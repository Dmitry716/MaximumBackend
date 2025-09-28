import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { type Repository, Between } from "typeorm"
import { Statistics } from "./entities/statistics.entity"
import { EnrollmentStatistics } from "./entities/enrollment-statistics.entity"
import { RevenueStatistics } from "./entities/revenue-statistics.entity"
import { CompletionStatistics } from "./entities/completion-statistics.entity"
import { User } from "../user/entities/user.entity"
import { Course } from "../course/entities/course.entity"
import { Enrollment } from "../enrollment/entities/enrollment.entity"
import { Payment } from "../payment/entities/payment.entity"
import { UserRole } from "../user/enums/user-role.enum"
import { CourseStatus } from "../course/enums/course-status.enum"
import { PaymentStatus } from "../payment/enums/payment-status.enum"
import type { DashboardStatisticsDto } from "./dto/dashboard-statistics.dto"

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistics)
    private statisticsRepository: Repository<Statistics>,
    @InjectRepository(EnrollmentStatistics)
    private enrollmentStatsRepository: Repository<EnrollmentStatistics>,
    @InjectRepository(RevenueStatistics)
    private revenueStatsRepository: Repository<RevenueStatistics>,
    @InjectRepository(CompletionStatistics)
    private completionStatsRepository: Repository<CompletionStatistics>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>
  ) { }

  async getDashboardStatistics(userId?: number): Promise<DashboardStatisticsDto> {
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  
    const userCondition = userId ? { id: userId } : {}
    const courseCondition = userId ? { instructor: { id: userId } } : {}
  
    const totalStudents = await this.userRepository.count({
      where: { role: UserRole.STUDENT, ...userCondition },
    })
  
    const totalCourses = await this.courseRepository.count({
      where: courseCondition,
    })
  
    const activeCourses = await this.courseRepository.count({
      where: { status: CourseStatus.PUBLISHED, ...courseCondition },
    })
  
    const paymentsQuery = this.paymentRepository
      .createQueryBuilder("payment")
      .select("SUM(payment.amount)", "total")
      .where("payment.status = :status", { status: PaymentStatus.COMPLETED })
  
    if (userId) paymentsQuery.andWhere("payment.userId = :userId", { userId })
  
    const paymentsResult = await paymentsQuery.getRawOne()
    const totalRevenue = paymentsResult?.total ? Number.parseFloat(paymentsResult.total) : 0
  
    const newStudentsThisMonth = await this.userRepository.count({
      where: {
        role: UserRole.STUDENT,
        createdAt: Between(firstDayOfMonth, now),
        ...userCondition,
      },
    })
  
    const monthlyPaymentsQuery = this.paymentRepository
      .createQueryBuilder("payment")
      .select("SUM(payment.amount)", "total")
      .where("payment.status = :status", { status: PaymentStatus.COMPLETED })
      .andWhere("payment.createdAt BETWEEN :start AND :end", {
        start: firstDayOfMonth,
        end: now,
      })
  
    if (userId) monthlyPaymentsQuery.andWhere("payment.userId = :userId", { userId })
  
    const monthlyPaymentsResult = await monthlyPaymentsQuery.getRawOne()
    const revenueThisMonth = monthlyPaymentsResult?.total ? Number.parseFloat(monthlyPaymentsResult.total) : 0
  
    const monthlyRevenueQuery = this.paymentRepository
      .createQueryBuilder("payment")
      .select('DATE_FORMAT(payment.createdAt, "%Y-%m")', "month")
      .addSelect("SUM(payment.amount)", "amount")
      .where("payment.status = :status", { status: PaymentStatus.COMPLETED })
      .andWhere("payment.createdAt >= :startDate", { startDate: sixMonthsAgo })
  
    if (userId) monthlyRevenueQuery.andWhere("payment.userId = :userId", { userId })
  
    const monthlyRevenueData = await monthlyRevenueQuery
      .groupBy("month")
      .orderBy("month", "ASC")
      .getRawMany()
  
    const monthlyRevenue = monthlyRevenueData.map((item) => ({
      month: item.month,
      amount: Number.parseFloat(item.amount || 0),
    }))
  
    const topCoursesByEnrollmentQuery = this.enrollmentRepository
      .createQueryBuilder("enrollment")
      .select("course.id", "id")
      .addSelect("course.name", "name")
      .addSelect("COUNT(*)", "enrollments")
      .innerJoin("enrollment.course", "course")
  
    if (userId) topCoursesByEnrollmentQuery.where("course.instructorId = :userId", { userId })
  
    const topCoursesByEnrollmentData = await topCoursesByEnrollmentQuery
      .groupBy("course.id")
      .orderBy("enrollments", "DESC")
      .limit(5)
      .getRawMany()
  
    const topCoursesByEnrollment = topCoursesByEnrollmentData.map((item) => ({
      id: Number.parseInt(item.id),
      name: item.name,
      enrollments: Number.parseInt(item.enrollments),
    }))
  
    const topCoursesByRevenueQuery = this.paymentRepository
      .createQueryBuilder("payment")
      .select("course.id", "id")
      .addSelect("course.name", "name")
      .addSelect("SUM(payment.amount)", "revenue")
      .innerJoin("payment.course", "course")
      .where("payment.status = :status", { status: PaymentStatus.COMPLETED })
  
    if (userId) topCoursesByRevenueQuery.andWhere("payment.userId = :userId", { userId })
  
    const topCoursesByRevenueData = await topCoursesByRevenueQuery
      .groupBy("course.id")
      .orderBy("revenue", "DESC")
      .limit(5)
      .getRawMany()
  
    const topCoursesByRevenue = topCoursesByRevenueData.map((item) => ({
      id: Number.parseInt(item.id),
      name: item.name,
      revenue: Number.parseFloat(item.revenue || 0),
    }))
  
    const avgCompletionQuery = this.enrollmentRepository
      .createQueryBuilder("enrollment")
      .select("AVG(enrollment.completionPercentage)", "average")
  
    if (userId) avgCompletionQuery.innerJoin("enrollment.course", "course").where("course.instructorId = :userId", { userId })
  
    const completionRateResult = await avgCompletionQuery.getRawOne()
    const averageCompletionRate = completionRateResult?.average ? Number.parseFloat(completionRateResult.average) : 0
  
    const statsQuery = this.enrollmentRepository
      .createQueryBuilder("enrollment")
      .select("course.name", "name")
      .addSelect("AVG(enrollment.completionPercentage)", "average")
      .innerJoin("enrollment.course", "course")
  
    if (userId) statsQuery.where("course.instructorId = :userId", { userId })
  
    const rawData = await statsQuery
      .groupBy("course.name")
      .orderBy("course.name", "ASC")
      .getRawMany()
  
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#ef4444", "#14b8a6", "#6366f1", "#22c55e", "#eab308"]
  
    const courseEnrollmentStats = rawData.map((entry, index) => {
      const average = parseFloat(entry.average)
      return {
        name: entry.name,
        value: Math.round(average),
        color: colors[index % colors.length],
      }
    })
  
    const completionQ = this.enrollmentRepository
      .createQueryBuilder("enrollment")
      .select('DATE_FORMAT(enrollment.updatedAt, "%Y-%m")', "month")
      .addSelect("COUNT(*)", "count")
      .where("enrollment.updatedAt >= :startDate", { startDate: sixMonthsAgo })
      .andWhere("enrollment.status = :status", { status: 'completed' })
  
    const enrollmentsQ = this.enrollmentRepository
      .createQueryBuilder("enrollment")
      .select('DATE_FORMAT(enrollment.updatedAt, "%Y-%m")', "month")
      .addSelect("COUNT(*)", "count")
      .where("enrollment.updatedAt >= :startDate", { startDate: sixMonthsAgo })
  
    if (userId) {
      completionQ.innerJoin("enrollment.course", "course").andWhere("course.instructorId = :userId", { userId })
      enrollmentsQ.innerJoin("enrollment.course", "course").andWhere("course.instructorId = :userId", { userId })
    }
  
    const monthlyCompletionData = await completionQ
      .groupBy('DATE_FORMAT(enrollment.updatedAt, "%Y-%m")')
      .orderBy('DATE_FORMAT(enrollment.updatedAt, "%Y-%m")', "ASC")
      .getRawMany()
  
    const monthlyEnrollmentsData = await enrollmentsQ
      .groupBy('DATE_FORMAT(enrollment.updatedAt, "%Y-%m")')
      .orderBy('DATE_FORMAT(enrollment.updatedAt, "%Y-%m")', "ASC")
      .getRawMany()
  
    const completionMap = Object.fromEntries(
      monthlyCompletionData.map(item => [item.month, Number(item.count)])
    )
  
    const enrollmentMap = Object.fromEntries(
      monthlyEnrollmentsData.map(item => [item.month, Number(item.count)])
    )
  
    const months = Array.from(new Set([
      ...monthlyEnrollmentsData.map(i => i.month),
      ...monthlyCompletionData.map(i => i.month),
    ])).sort()
  
    const monthlyCompletionAndEnrollment = months.map(month => ({
      name: month,
      enrollments: enrollmentMap[month] ?? 0,
      completions: completionMap[month] ?? 0,
    }))
  
    return {
      totalStudents,
      totalCourses,
      activeCourses,
      totalRevenue,
      averageCompletionRate,
      monthlyCompletionAndEnrollment,
      newStudentsThisMonth,
      revenueThisMonth,
      courseEnrollmentStats,
      monthlyRevenue,
      topCoursesByEnrollment,
      topCoursesByRevenue,
    }
  }
  

  async getGeneralStatistics(startDate?: Date, endDate?: Date): Promise<Statistics[]> {
    const queryBuilder = this.statisticsRepository.createQueryBuilder("stats")

    if (startDate && endDate) {
      queryBuilder.where("stats.date BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
    }

    return queryBuilder.orderBy("stats.date", "DESC").getMany()
  }

  async getEnrollmentStatistics(courseId?: number, startDate?: Date, endDate?: Date): Promise<EnrollmentStatistics[]> {
    const queryBuilder = this.enrollmentStatsRepository
      .createQueryBuilder("stats")
      .leftJoinAndSelect("stats.course", "course")

    if (courseId) {
      queryBuilder.where("stats.courseId = :courseId", { courseId })
    }

    if (startDate && endDate) {
      queryBuilder.andWhere("stats.date BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
    }

    return queryBuilder.orderBy("stats.date", "DESC").getMany()
  }

  async getRevenueStatistics(courseId?: number, startDate?: Date, endDate?: Date): Promise<RevenueStatistics[]> {
    const queryBuilder = this.revenueStatsRepository
      .createQueryBuilder("stats")
      .leftJoinAndSelect("stats.course", "course")

    if (courseId) {
      queryBuilder.where("stats.courseId = :courseId", { courseId })
    }

    if (startDate && endDate) {
      queryBuilder.andWhere("stats.date BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
    }

    return queryBuilder.orderBy("stats.date", "DESC").getMany()
  }

  async getCompletionStatistics(courseId?: number, startDate?: Date, endDate?: Date): Promise<CompletionStatistics[]> {
    const queryBuilder = this.completionStatsRepository
      .createQueryBuilder("stats")
      .leftJoinAndSelect("stats.course", "course")

    if (courseId) {
      queryBuilder.where("stats.courseId = :courseId", { courseId })
    }

    if (startDate && endDate) {
      queryBuilder.andWhere("stats.date BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
    }

    return queryBuilder.orderBy("stats.date", "DESC").getMany()
  }

  // Method to generate daily statistics (can be called by a cron job)
  async generateDailyStatistics(): Promise<void> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Count total students
    const totalStudents = await this.userRepository.count({
      where: { role: UserRole.STUDENT },
    })

    // Count active courses
    const activeCourses = await this.courseRepository.count({
      where: { status: CourseStatus.PUBLISHED },
    })

    // Calculate total revenue
    const paymentsResult = await this.paymentRepository
      .createQueryBuilder("payment")
      .select("SUM(payment.amount)", "total")
      .where("payment.status = :status", { status: PaymentStatus.COMPLETED })
      .getRawOne()

    const totalRevenue = paymentsResult?.total ? Number.parseFloat(paymentsResult.total) : 0

    // Calculate completion rate
    const completionRateResult = await this.enrollmentRepository
      .createQueryBuilder("enrollment")
      .select("AVG(enrollment.completionPercentage)", "average")
      .getRawOne()

    const completionRate = completionRateResult?.average ? Number.parseFloat(completionRateResult.average) : 0

    // Create general statistics
    const generalStats = this.statisticsRepository.create({
      date: today,
      totalStudents,
      activeCourses,
      totalRevenue,
      completionRate,
    })

    await this.statisticsRepository.save(generalStats)

    // Generate course-specific statistics
    const courses = await this.courseRepository.find()

    for (const course of courses) {
      // Count enrollments for this course
      const enrollments = await this.enrollmentRepository.count({
        where: { courseId: course.id },
      })

      // Create enrollment statistics
      const enrollmentStats = this.enrollmentStatsRepository.create({
        date: today,
        course,
        courseId: course.id,
        enrollments,
      })

      await this.enrollmentStatsRepository.save(enrollmentStats)

      // Calculate revenue for this course
      const courseRevenueResult = await this.paymentRepository
        .createQueryBuilder("payment")
        .select("SUM(payment.amount)", "total")
        .where("payment.courseId = :courseId", { courseId: course.id })
        .andWhere("payment.status = :status", { status: PaymentStatus.COMPLETED })
        .getRawOne()

      const courseRevenue = courseRevenueResult?.total ? Number.parseFloat(courseRevenueResult.total) : 0

      // Create revenue statistics
      const revenueStats = this.revenueStatsRepository.create({
        date: today,
        course,
        courseId: course.id,
        revenue: courseRevenue,
      })

      await this.revenueStatsRepository.save(revenueStats)

      // Count completions for this course
      const completions = await this.enrollmentRepository.count({
        where: {
          courseId: course.id,
          completionPercentage: 100,
        },
      })

      // Create completion statistics
      const completionStats = this.completionStatsRepository.create({
        date: today,
        course,
        courseId: course.id,
        completions,
      })

      await this.completionStatsRepository.save(completionStats)
    }
  }
}


import { Request, Response, NextFunction } from 'express';
import { NewsService } from '@/services';
import { createSuccessResponse } from '@/utils';
import { asyncHandler } from '@/middleware/errorHandler';
import { QueryParams } from '@/types';

/**
 * 新闻控制器
 */
export class NewsController {
  /**
   * 获取新闻列表
   */
  static getNews = asyncHandler(async (req: Request, res: Response) => {
    const params: QueryParams = {
      page: parseInt(req.query.page as string) || 1,
      limit: Math.min(parseInt(req.query.limit as string) || 10, 50), // 最大50条
      category: req.query.category as string,
      lang: req.query.lang as string || 'zh',
      search: req.query.search as string,
      sort: req.query.sort as string || 'published_at',
      order: req.query.order as 'asc' | 'desc' || 'desc',
    };

    const result = await NewsService.getNews(params);

    res.json(createSuccessResponse(result, 'News fetched successfully'));
  });

  /**
   * 根据ID获取新闻详情
   */
  static getNewsById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const article = await NewsService.getNewsById(id);

    res.json(createSuccessResponse(article, 'News article fetched successfully'));
  });

  /**
   * 根据slug获取新闻详情
   */
  static getNewsBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const article = await NewsService.getNewsBySlug(slug);

    res.json(createSuccessResponse(article, 'News article fetched successfully'));
  });

  /**
   * 获取特色新闻
   */
  static getFeaturedNews = asyncHandler(async (req: Request, res: Response) => {
    const lang = req.query.lang as string || 'zh';
    const limit = Math.min(parseInt(req.query.limit as string) || 5, 10);

    const articles = await NewsService.getFeaturedNews(lang, limit);

    res.json(createSuccessResponse(articles, 'Featured news fetched successfully'));
  });

  /**
   * 获取相关新闻
   */
  static getRelatedNews = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const categoryId = req.query.categoryId as string;
    const lang = req.query.lang as string || 'zh';
    const limit = Math.min(parseInt(req.query.limit as string) || 4, 10);

    const articles = await NewsService.getRelatedNews(id, categoryId, lang, limit);

    res.json(createSuccessResponse(articles, 'Related news fetched successfully'));
  });

  /**
   * 获取新闻分类列表
   */
  static getCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await NewsService.getCategories();

    res.json(createSuccessResponse(categories, 'News categories fetched successfully'));
  });

  /**
   * 获取最新新闻
   */
  static getLatestNews = asyncHandler(async (req: Request, res: Response) => {
    const lang = req.query.lang as string || 'zh';
    const limit = Math.min(parseInt(req.query.limit as string) || 6, 20);

    const articles = await NewsService.getLatestNews(lang, limit);

    res.json(createSuccessResponse(articles, 'Latest news fetched successfully'));
  });

  /**
   * 搜索新闻
   */
  static searchNews = asyncHandler(async (req: Request, res: Response) => {
    const { q: searchTerm } = req.query;
    
    if (!searchTerm || typeof searchTerm !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Search term is required',
        error: 'MISSING_SEARCH_TERM',
      });
      return;
    }

    const lang = req.query.lang as string || 'zh';
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

    const result = await NewsService.searchNews(searchTerm, lang, page, limit);

    res.json(createSuccessResponse(result, 'News search completed successfully'));
  });
}

export default NewsController;

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Calendar, Eye, Heart, MessageCircle, Share2, ArrowLeft, User, Clock, ChevronRight } from 'lucide-react';
import { useArticleLikes, useArticleComments, useIncrementViews, useToggleLike, useAddComment } from '../../../hooks/useArticles';
import { getUserFingerprint } from '../../../utils/commentStorage';
import { isArticleViewed, markArticleAsViewed } from '../../../utils/viewTracker';
import { getArticleViews, getAuthorName as getAuthorNameFromAPI, type Article } from '../../../services/api';

interface Comment {
  _id: string;
  text: string;
  userEmail?: string;
  createdAt: string;
}

interface ArticleDetailClientProps {
  article: Article;
  relatedArticles: Article[];
}

export default function ArticleDetailClient({ article, relatedArticles }: ArticleDetailClientProps) {
  const params = useParams();
  const articleId = params.id as string;
  
  const [mounted, setMounted] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commenterName, setCommenterName] = useState('');
  const [commenterEmail, setCommenterEmail] = useState('');
  const [fingerprint, setFingerprint] = useState('');

  // Получение fingerprint для пользователя
  useEffect(() => {
    setFingerprint(getUserFingerprint());
  }, []);

  // Хуки для работы с лайками и комментариями
  const { data: likesData } = useArticleLikes(articleId, fingerprint);
  const { data: commentsData } = useArticleComments(articleId);
  const toggleLike = useToggleLike();
  const addComment = useAddComment();
  const incrementViews = useIncrementViews();

  useEffect(() => {
    setMounted(true);
    // Увеличиваем счетчик просмотров только один раз для каждой статьи
    if (!isArticleViewed(articleId)) {
      markArticleAsViewed(articleId);
      incrementViews.mutate(articleId);
    }
  }, [articleId, incrementViews]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAuthorName = getAuthorNameFromAPI;

  const getImageUrl = (article: Article) => {
    // First check for media.featuredImage.url
    if (article.media?.featuredImage?.url) {
      return article.media.featuredImage.url;
    }
    // Then check for imageUrl
    if (article.imageUrl) {
      if (article.imageUrl.startsWith('http')) return article.imageUrl;
      return `https://infocryptox.com${article.imageUrl.startsWith('/') ? '' : '/'}${article.imageUrl}`;
    }
    // Fallback image
    return 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=400&fit=crop';
  };

  const getPreviewText = (article: Article, maxLength: number = 100) => {
    // First try to use excerpt if available
    if (article.excerpt && article.excerpt.trim()) {
      const excerpt = article.excerpt.trim();
      if (excerpt.length <= maxLength) return excerpt;
      return excerpt.substring(0, maxLength) + '...';
    }
    
    // Fallback to content
    if (!article.content) {
      return 'Click to read more...';
    }
    
    // Remove HTML tags and decode HTML entities
    const textContent = article.content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#39;/g, "'") // Replace &#39; with '
      .trim(); // Remove whitespace
    
    if (!textContent || textContent.length === 0) {
      return 'Click to read more...';
    }
    
    if (textContent.length <= maxLength) return textContent;
    return textContent.substring(0, maxLength) + '...';
  };

  const handleShare = async (platform?: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = article.title;

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
    setShowShareMenu(false);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !commenterName.trim() || !commenterEmail.trim() || !fingerprint) return;

    try {
      await addComment.mutateAsync({
        articleId,
        comment: {
          content: newComment.trim(),
          author: commenterName.trim(),
          email: commenterEmail.trim(),
          fingerprint
        }
      });

      // Очищаем форму после успешной отправки
      setNewComment('');
      setCommenterName('');
      setCommenterEmail('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const processContent = (content: string) => {
    // Простая обработка HTML контента
    return { __html: content };
  };

  if (!mounted) {
    return <div className="min-h-screen bg-slate-900"></div>;
  }

  const currentLikes = likesData?.stats.total || article.likes || 0;

  // console.log(likesData, );
  const isLiked = likesData?.userLiked || false;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation Breadcrumb */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/articles" className="hover:text-white transition-colors">
              Articles
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white truncate">{article.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            src={getImageUrl(article)}
            alt={article.title}
            className="w-full h-96 object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&h=600&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
          {/* Back Button */}
          <Link 
            href="/articles"
            className="inline-flex items-center text-gray-300 hover:text-white mb-8 transition-colors bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Articles
          </Link>

          {/* Article Header */}
          <div className="mt-24 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                {article.category}
              </span>
              {article.tags && article.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="bg-slate-700/80 backdrop-blur-sm text-gray-300 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>
            
            {article.excerpt && (
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl">
                {article.excerpt}
              </p>
            )}

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-gray-300 bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 mb-8">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span className="font-medium">{getAuthorName(article.author)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(article.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>5 min read</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                                  <span>{getArticleViews(article)} views</span>
              </div>
            </div>

            {/* Article Image */}
            {article.imageUrl && (
              <div className="mb-8">
                <img
                  src={getImageUrl(article)}
                  alt={article.title}
                  className="w-full h-96 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&h=600&fit=crop';
                  }}
                />
              </div>
            )}

            {/* Article Content */}
            <article className="prose prose-lg prose-invert max-w-none mb-12">
              <div 
                dangerouslySetInnerHTML={processContent(article.content)}
                className="text-gray-300 leading-relaxed text-lg"
              />
            </article>

            {/* Social Actions */}
            <div className="flex items-center justify-between py-8 border-t border-slate-700 mb-12">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => toggleLike.mutate({ articleId, fingerprint })}
                  disabled={!fingerprint || toggleLike.isPending}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                    isLiked ? 'bg-red-600 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{currentLikes}</span>
                </button>
                
                <div className="flex items-center space-x-2 text-gray-400">
                  <MessageCircle className="w-5 h-5" />
                  <span>{commentsData?.comments?.length || 0} Comments</span>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>

                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 z-10">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:bg-slate-700 rounded-t-lg"
                    >
                      Share on Twitter
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:bg-slate-700"
                    >
                      Share on Facebook
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:bg-slate-700"
                    >
                      Share on LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:bg-slate-700 rounded-b-lg"
                    >
                      Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-6">
                Comments ({commentsData?.comments?.length || 0})
              </h3>

              {/* Add Comment Form */}
              <form onSubmit={handleCommentSubmit} className="bg-slate-800 rounded-lg p-6 mb-8">
                <h4 className="text-lg font-semibold text-white mb-4">Add a Comment</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={commenterName}
                    onChange={(e) => setCommenterName(e.target.value)}
                    className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={commenterEmail}
                    onChange={(e) => setCommenterEmail(e.target.value)}
                    className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <textarea
                    rows={4}
                    placeholder="Write your comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={addComment.isPending || !fingerprint}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addComment.isPending ? 'Posting...' : 'Post Comment'}
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {commentsData?.comments?.map((comment: Comment) => (
                  <div key={comment._id} className="bg-slate-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {comment.userEmail?.charAt(0)?.toUpperCase() || 'A'}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{comment.userEmail?.split('@')[0] || 'Anonymous'}</p>
                          <p className="text-gray-400 text-sm">{formatDate(comment.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Actions and Comments - moved to separate section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="w-full">
          
          {/* Main Content */}
          <div className="w-full">
            {/* Related Articles */}
            <div className="mt-16 pt-8 border-t border-slate-700">
              <h3 className="text-3xl font-bold text-white mb-8 text-center">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedArticles.slice(0, 4).map((relatedArticle) => (
                  <Link
                    key={relatedArticle._id}
                    href={`/article/${relatedArticle._id}`}
                    className="group"
                  >
                    <div className="bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-700 transition-colors">
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={getImageUrl(relatedArticle)}
                          alt={relatedArticle.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=250&fit=crop';
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="text-white font-semibold line-clamp-2 group-hover:text-blue-400 transition-colors mb-2">
                          {relatedArticle.title}
                        </h4>
                        <p className="text-gray-400 text-xs line-clamp-2 mb-3">
                          {getPreviewText(relatedArticle, 80)}
                        </p>
                        <div className="flex items-center justify-between text-gray-400 text-sm">
                          <span>{formatDate(relatedArticle.createdAt)}</span>
                          <span>{getArticleViews(relatedArticle)} views</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
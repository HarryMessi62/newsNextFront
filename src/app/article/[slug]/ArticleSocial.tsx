'use client';
import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { useArticleLikes, useArticleComments, useToggleLike, useAddComment, useIncrementViews } from '../../../hooks/useArticles';
import { getUserFingerprint } from '../../../utils/commentStorage';
import { isArticleViewed, markArticleAsViewed } from '../../../utils/viewTracker';

interface Props {
  articleId: string;
  initialLikes: number;
}

export default function ArticleSocial({ articleId, initialLikes }: Props) {
  const [fingerprint, setFingerprint] = useState('');
  const [comment, setComment] = useState('');
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [shareOpen, setShareOpen] = useState(false);

  // ─── API hooks ───
  const { data: likesData } = useArticleLikes(articleId, fingerprint);
  const { data: commentsData } = useArticleComments(articleId);
  const toggleLike = useToggleLike();
  const addComment = useAddComment();
  const incrementViews = useIncrementViews();

  // ─── once per user per article ───
  useEffect(() => {
    setFingerprint(getUserFingerprint());
    if (!isArticleViewed(articleId)) {
      markArticleAsViewed(articleId);
      incrementViews.mutate(articleId);
    }
  }, [articleId, incrementViews]);

  const likes = likesData?.stats.total ?? initialLikes;
  const userLiked = likesData?.userLiked ?? false;

  const postComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !fingerprint) return;
    await addComment.mutateAsync({
      articleId,
      comment: { content: comment.trim(), author: author.trim() || 'Anonymous', email, fingerprint }
    });
    setComment('');
  };

  const share = async (platform?: string) => {
    const url = window.location.href;
    const title = document.title;
    const open = (u: string) => window.open(u, '_blank');
    if (platform === 'twitter') open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`);
    if (platform === 'facebook') open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
    if (platform === 'linkedin') open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
    if (platform === 'copy') await navigator.clipboard.writeText(url);
    setShareOpen(false);
  };

  return (
    <div className="pb-20">
      {/* ─── Social bar ─── */}
      <div className="flex items-center justify-between py-8">
        <button onClick={() => toggleLike.mutate({ articleId, fingerprint })} className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${userLiked ? 'bg-red-600 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}>
          <Heart className={`w-5 h-5 ${userLiked ? 'fill-current' : ''}`} />
          <span>{likes}</span>
        </button>

        <div className="flex items-center space-x-2 text-gray-400">
          <MessageCircle className="w-5 h-5" />
          <span>{commentsData?.comments.length ?? 0} Comments</span>
        </div>

        <div className="relative">
          <button onClick={() => setShareOpen(!shareOpen)} className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
          {shareOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-slate-800 rounded-lg shadow-lg border border-slate-700 z-10">
              <button className="w-full text-left px-4 py-2 hover:bg-slate-700 text-gray-300 rounded-t-lg" onClick={() => share('twitter')}>Twitter</button>
              <button className="w-full text-left px-4 py-2 hover:bg-slate-700 text-gray-300" onClick={() => share('facebook')}>Facebook</button>
              <button className="w-full text-left px-4 py-2 hover:bg-slate-700 text-gray-300" onClick={() => share('linkedin')}>LinkedIn</button>
              <button className="w-full text-left px-4 py-2 hover:bg-slate-700 text-gray-300 rounded-b-lg" onClick={() => share('copy')}>Copy link</button>
            </div>
          )}
        </div>
      </div>

      {/* ─── Comments ─── */}
      <h3 className="text-2xl font-bold text-white mb-6">Comments ({commentsData?.comments.length ?? 0})</h3>
      <form onSubmit={postComment} className="bg-slate-800 rounded-lg p-6 mb-10 space-y-4">
        <div className="flex gap-4 flex-col md:flex-row">
          <input placeholder="Your name" value={author} onChange={e => setAuthor(e.target.value)} className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white" />
          <input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white" />
        </div>
        <textarea placeholder="Write your comment…" value={comment} onChange={e => setComment(e.target.value)} rows={4} className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white" />
        <button disabled={addComment.isPending || !fingerprint} className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50">{addComment.isPending ? 'Posting…' : 'Post Comment'}</button>
      </form>

      {commentsData?.comments.map(c => (
        <div key={c._id} className="bg-slate-800 rounded-lg p-6 mb-6">
          <p className="text-gray-300 mb-2">{(c as any).content ?? (c as any).text}</p>
          <p className="text-gray-500 text-xs">{new Date(c.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
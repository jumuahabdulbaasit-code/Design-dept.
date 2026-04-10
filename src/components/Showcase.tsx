import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Heart, Download, Plus, User as UserIcon, Loader2, Trash2 } from "lucide-react";
import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc, increment } from "firebase/firestore";
import { useAuth } from "@/src/lib/AuthContext";
import PostDesignModal from "./PostDesignModal";
import AuthModal from "./AuthModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Design {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  createdAt: any;
  likes: number;
}

export default function Showcase() {
  const { user, isAdmin } = useAuth();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "designs"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const designsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Design[];
      setDesigns(designsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "designs");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this design?")) return;
    try {
      await deleteDoc(doc(db, "designs", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `designs/${id}`);
    }
  };

  const handleLike = async (id: string) => {
    if (!user) return;
    try {
      const designRef = doc(db, "designs", id);
      await updateDoc(designRef, {
        likes: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `designs/${id}`);
    }
  };

  const handleDownload = async (imageUrl: string, title: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(imageUrl, '_blank');
    }
  };

  const handlePostClick = () => {
    if (user) {
      setIsPostModalOpen(true);
    } else {
      // We need a way to trigger the AuthModal from here.
      // Since AuthModal is in Navbar, we could either move it to a global state
      // or just add another AuthModal here.
      setIsAuthModalOpen(true);
    }
  };

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <section id="showcase" className="py-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Design Showcase</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A collaborative space where designers drop their work for community inspiration. 
            Download any design to study its composition and style.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Post Card */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePostClick}
            className="group relative aspect-[4/5] rounded-3xl border-2 border-dashed border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Drop to Showcase</h3>
            <p className="text-sm text-muted-foreground">Share your latest work with the community</p>
          </motion.button>

          {loading ? (
            Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-3xl overflow-hidden">
                <Skeleton className="aspect-[4/5] w-full" />
                <div className="p-4 space-y-3">
                  <div className="flex gap-2 items-center">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-5 w-3/4" />
                </div>
              </div>
            ))
          ) : (
            <AnimatePresence>
              {designs.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative bg-card border border-border rounded-3xl overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="aspect-[4/5] overflow-hidden relative">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleDownload(item.imageUrl, item.title)}
                            className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-lg"
                            title="Download for Inspiration"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleLike(item.id)}
                            className="p-3 bg-white/20 backdrop-blur text-white rounded-full hover:scale-110 transition-transform flex items-center gap-1.5"
                            title="Like Design"
                          >
                            <Heart className={`w-5 h-5 ${item.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                            {item.likes > 0 && <span className="text-xs font-bold">{item.likes}</span>}
                          </button>
                        </div>
                        
                        {(isAdmin || (user && user.uid === item.authorId)) && (
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 bg-red-500/20 backdrop-blur text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                            title="Delete Design"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      {item.authorPhoto ? (
                        <img src={item.authorPhoto} alt={item.authorName} className="w-6 h-6 rounded-full border border-border" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center border border-border">
                          <UserIcon className="w-3 h-3 text-muted-foreground" />
                        </div>
                      )}
                      <span className="text-xs font-bold tracking-tight">{item.authorName}</span>
                    </div>
                    <h3 className="text-sm font-semibold line-clamp-1 text-muted-foreground">{item.title}</h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <PostDesignModal 
          isOpen={isPostModalOpen} 
          onClose={() => setIsPostModalOpen(false)} 
        />

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
      </div>
    </section>
  );
}

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }


  console.log(session);
  

  // Demo user fallback for development
  let user = null;
  let blogs = [];
  let totalBlogs = 0;
let totalViews = 0
  let totalLikes = { _sum: { likes: 0 } };

  // Try to fetch from database, fall back to demo data
  try {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        blogs: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });
  } catch (error) {
    console.error("[v0] Database error fetching user:", error);
  }

  // Use session data as fallback for demo user
  if (!user) {
    user = {
      id: session.user.id,
      email: session.user.email || "",
      name: session.user.name || "Developer",
      bio: "Welcome to your dashboard",
      image: session.user.image || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      blogs: [],
    };
  }

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user.name || "Developer"}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s your blogging dashboard
          </p>
        </div>

        {/* CTA Button */}
        <div className="mb-8">
          <Link href="/dashboard/create">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded">
              + Create New Article
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="border border-border rounded p-6">
            <div className="text-sm text-muted-foreground mb-2">
              Total Articles
            </div>
            <div className="text-3xl font-bold">{totalBlogs}</div>
          </div>

          <div className="border border-border rounded p-6">
            <div className="text-sm text-muted-foreground mb-2">
              Total Views
            </div>
            <div className="text-3xl font-bold">
                {totalViews}
            </div>
          </div>

          <div className="border border-border rounded p-6">
            <div className="text-sm text-muted-foreground mb-2">
              Total Likes
            </div>
            <div className="text-3xl font-bold">
              {totalLikes._sum.likes || 0}
            </div>
          </div>

          <div className="border border-border rounded p-6">
            <div className="text-sm text-muted-foreground mb-2">
              Avg. Read Time
            </div>
            <div className="text-3xl font-bold">
              {user.blogs.length > 0
                ? Math.round(
                    user.blogs.reduce((sum, b) => sum + b.readTime, 0) /
                      user.blogs.length,
                  )
                : 0}
              m
            </div>
          </div>
        </div>

        {/* Recent Articles */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Articles</h2>

          {user.blogs.length === 0 ? (
            <div className="border border-border rounded p-12 text-center">
              <p className="text-muted-foreground mb-4">
                No articles yet. Start writing your first one!
              </p>
              <Link href="/dashboard/create">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded">
                  Create Article
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {user.blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="border border-border rounded p-6 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">{blog.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        {blog.excerpt || "No excerpt provided"}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{blog.readTime} min read</span>
                        <span>•</span>
                        <span>{blog.views} views</span>
                        <span>•</span>
                        <span>{blog.likes} likes</span>
                        <span>•</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            blog.status === "PUBLISHED"
                              ? "bg-green-100 text-green-800"
                              : blog.status === "SCHEDULED"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {blog.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link href={`/dashboard/blogs/${blog.id}/edit`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="border border-border"
                        >
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { ReactNode, useContext } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";

export interface Post {
  id: string;
  author: string;
  description: string;
  images: string[];
  lastChangeTime: string;
  lastChangeOperation: string;
  likes: string[];
  comments: string[];
  liked: boolean;
  tags: string[];
}

interface PostProvider {
  postImages: (
    images: FileList,
    description: string,
    tags: string[]
  ) => Promise<void>;
  fetchPosts: () => Promise<Post[]>;
  fetchPreview: (id: string) => Promise<string>;
  fetchImage: (id: string) => Promise<string>;
  likePost: (id: string) => Promise<void>;
  searchTags: (
    search: string,
    tags: string[]
  ) => Promise<
    {
      name: string;
      posts: string[];
    }[]
  >;
}

export const PostContext = React.createContext({} as PostProvider);

export function usePost() {
  return useContext(PostContext);
}

export function PostProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth();
  const value = {
    postImages,
    fetchPosts,
    fetchImage,
    likePost,
    fetchPreview,
    searchTags,
  };

  async function postImages(
    images: FileList,
    description: string,
    tags: string[]
  ) {
    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }
    formData.append("description", description);
    formData.append("tags", JSON.stringify(tags));
    formData.append("token", getToken());

    const response = await fetch("/api/posts", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      return;
    }
    const data = await response.json();
    throw new Error("Something went wrong: " + data.status);
  }

  async function fetchPosts() {
    const response = await fetch("/api/posts", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data.posts;
    }
  }

  async function fetchPreview(id: string) {
    return fetch(`/api/images/${id}/preview`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((response) => {
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Something went wrong");
        }
        return new ReadableStream({
          start(controller) {
            return pump();
            function pump(): any {
              return reader!.read().then(({ done, value }) => {
                // When no more data needs to be consumed, close the stream
                if (done) {
                  controller.close();
                  return;
                }
                // Enqueue the next data chunk into our target stream
                controller.enqueue(value);
                return pump();
              });
            }
          },
        });
      })
      .then((stream) => new Response(stream))
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        return url;
      })
      .then((url) => {
        return url;
      });
  }

  async function fetchImage(id: string) {
    return fetch(`/api/images/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((response) => {
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Something went wrong");
        }
        return new ReadableStream({
          start(controller) {
            return pump();
            function pump(): any {
              return reader!.read().then(({ done, value }) => {
                // When no more data needs to be consumed, close the stream
                if (done) {
                  controller.close();
                  return;
                }
                // Enqueue the next data chunk into our target stream
                controller.enqueue(value);
                return pump();
              });
            }
          },
        });
      })
      .then((stream) => new Response(stream))
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        return url;
      })
      .then((url) => {
        return url;
      });
  }

  async function likePost(id: string) {
    const response = await fetch(`/api/posts/${id}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (response.ok) {
      return;
    }
  }

  async function searchTags(search: string, t: string[]) {
    const response = await fetch(`/api/tags`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ search, tags: t }),
    });

    const tags = await response.json();

    return tags.tags;
  }

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}

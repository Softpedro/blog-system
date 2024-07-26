"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AddArticleModal } from "../AddArticleModal";

export interface Article {
  id: number;
  title: string;
  content: string;
  publicationDate: string;
  author: string;
}

const ArticlesTable: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editArticle, setEditArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await axios.get<Article[]>(
          "http://localhost:3001/articles"
        );
        setArticles(data);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      }
    };

    fetchArticles();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditArticle(null);
  };

  const deleteArticle = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/articles/${id}`);
      setArticles(articles.filter((article) => article.id !== id));
    } catch (error) {
      console.error("Failed to delete article:", error);
    }
  };

  const openEditModal = (article: Article) => {
    setEditArticle(article);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto">
      <button
        className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={openModal}
      >
        Add Article
      </button>
      <AddArticleModal
        isOpen={isModalOpen}
        onClose={closeModal}
        article={editArticle}
      />
      <table className="table-auto w-full mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th>Title</th>
            <th>Content</th>
            <th>Publication Date</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id}>
              <td>{article.title}</td>
              <td>{article.content}</td>
              <td>{article.publicationDate}</td>
              <td>{article.author}</td>
              <td>
                <button
                  className="bg-red-500 text-white p-2 rounded"
                  onClick={() => deleteArticle(article.id)}
                >
                  Delete
                </button>
                <button
                  className="bg-green-500 text-white p-2 rounded ml-2"
                  onClick={() => openEditModal(article)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticlesTable;

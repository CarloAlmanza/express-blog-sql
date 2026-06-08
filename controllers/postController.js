const PostModel = require('../models/postModel');

class PostController {
    // GET /api/posts
    async index(req, res) {
        try {
            const posts = await PostModel.getAll();
            res.json({
                success: true,
                count: posts.length,
                data: posts
            });
        } catch (error) {
            console.error('Errore INDEX:', error);
            res.status(500).json({
                success: false,
                error: 'Errore nel recupero dei post'
            });
        }
    }

    // GET /api/posts/:id
    async show(req, res) {
        try {
            const { id } = req.params;
            const post = await PostModel.getById(id);

            if (!post) {
                return res.status(404).json({
                    success: false,
                    error: 'Post non trovato'
                });
            }

            res.json({
                success: true,
                data: post
            });
        } catch (error) {
            console.error('Errore SHOW:', error);
            res.status(500).json({
                success: false,
                error: 'Errore nel recupero del post'
            });
        }
    }

    // DELETE /api/posts/:id
    async destroy(req, res) {
        try {
            const { id } = req.params;
            const deleted = await PostModel.delete(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    error: 'Post non trovato'
                });
            }

            res.status(204).send();
        } catch (error) {
            console.error('Errore DESTROY:', error);
            res.status(500).json({
                success: false,
                error: 'Errore nell\'eliminazione del post'
            });
        }
    }

    // BONUS: POST /api/posts
    async create(req, res) {
        try {
            const { title, content, image, tags = [] } = req.body;

            // Validazione
            if (!title || !content) {
                return res.status(400).json({
                    success: false,
                    error: 'Titolo e contenuto sono obbligatori'
                });
            }

            // Crea il post
            const postId = await PostModel.create({ title, content, image });

            // Aggiungi i tags se presenti
            if (tags.length > 0) {
                await PostModel.addTagsToPost(postId, tags);
            }

            // Recupera il post completo con i tag
            const newPost = await PostModel.getById(postId);

            res.status(201).json({
                success: true,
                data: newPost
            });

        } catch (error) {
            console.error('Errore CREATE:', error);
            res.status(500).json({
                success: false,
                error: 'Errore nella creazione del post'
            });
        }
    }
}

module.exports = new PostController();
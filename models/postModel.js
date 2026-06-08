const { pool } = require('../config/database');

class PostModel {
    // GET all posts con i loro tag
    static async getAll() {
        const [rows] = await pool.query(`
            SELECT p.*, 
                   GROUP_CONCAT(t.label) as tags
            FROM posts p
            LEFT JOIN post_tag pt ON p.id = pt.post_id
            LEFT JOIN tags t ON pt.tag_id = t.id
            GROUP BY p.id
        `);

        return rows.map(post => ({
            ...post,
            tags: post.tags ? post.tags.split(',') : []
        }));
    }

    // GET single post con dettaglio tag
    static async getById(id) {
        // Prima: recupera il post
        const [posts] = await pool.query(
            'SELECT * FROM posts WHERE id = ?',
            [id]
        );

        if (posts.length === 0) return null;

        // Seconda: recupera i tag completi
        const [tags] = await pool.query(`
            SELECT t.id, t.label 
            FROM tags t
            JOIN post_tag pt ON t.id = pt.tag_id
            WHERE pt.post_id = ?
        `, [id]);

        return {
            ...posts[0],
            tags: tags
        };
    }

    // DELETE post (con CASCADE elimina anche relazioni)
    static async delete(id) {
        const [result] = await pool.query(
            'DELETE FROM posts WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    // BONUS: CREATE post
    static async create(postData) {
        const { title, content, image } = postData;

        const [result] = await pool.query(
            'INSERT INTO posts (title, content, image) VALUES (?, ?, ?)',
            [title, content, image || 'default.jpg']
        );

        return result.insertId;
    }

    // BONUS: Aggiungi tag a un post
    static async addTagsToPost(postId, tagIds) {
        for (const tagId of tagIds) {
            await pool.query(
                'INSERT INTO post_tag (post_id, tag_id) VALUES (?, ?)',
                [postId, tagId]
            );
        }
    }
}

module.exports = PostModel;
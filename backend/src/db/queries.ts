import pool from './connection.js';

export async function getZones() {
    try{
        const result = await pool.query('SELECT * FROM zones');
        return result.rows;
    } catch (error) {
        console.error('Error while retrieving zones');
        throw error;
    }
}

export async function getAllPhotos(limit: number = 50, offset: number = 0) {
     try{
        const result = await pool.query('SELECT photos.*, users.name as uploader_name FROM photos LEFT JOIN users ON photos.user_id = users.id ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
        return result.rows;
    } catch (error) {
        console.error('Error while retrieving photos');
        throw error;
    }
}

export async function getPhotoById(id: number) {
     try{
        const result = await pool.query('SELECT * FROM photos WHERE id = $1', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error while retrieving photo ID');
        throw error;
    }
}

export async function createPhoto(photo: { user_id: number; zone_id: number; category: string; notes: string; gps_allowed: boolean; latitude: number; longitude: number; image_url: string }) {
    try{
        const result = await pool.query('INSERT INTO photos (user_id, zone_id, category, notes, gps_allowed, latitude, longitude, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [photo.user_id, photo.zone_id, photo.category, photo.notes, photo.gps_allowed, photo.latitude, photo.longitude, photo.image_url]);
        return result.rows[0];
    }catch (error) {
        console.error('Error while creating photo');
        throw error;
    }
}

export async function updatePhotoStatus(id: number, status: string) {
    try{
        const result = await pool.query('UPDATE photos SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
        return result.rows[0];
    }catch (error) {
        console.error('Error while updating photo status');
        throw error;
    }
}

export async function getUserByEmail(email: string) {
    try{
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }catch (error) {
        console.error('Error while retrieving user by email');
        throw error;
    }
}

export async function createUser(user: { name: string; email: string; password_hash: string, role: string }) {
    try{
        const result = await pool.query('INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, created_at', [user.name, user.email, user.password_hash, user.role || 'viewer']);
        return result.rows[0];
    }catch (error) {
        console.error('Error while creating user');
        throw error;
    }
}

export async function getUserRoleByEmail(email: string) {
    try{
        const result = await pool.query('SELECT role FROM users WHERE email = $1', [email]);
        return result.rows[0]?.role;
    }catch (error) {
        console.error('Error while retrieving user role by email');
        throw error;
    }
}
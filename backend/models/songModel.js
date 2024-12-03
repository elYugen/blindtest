class Song {
    constructor({ title, artist, duration }) {
        if (!title || !artist || !duration) {
            throw new Error("Le champ 'title', 'artist' et 'duration' sont requis.");
        }
        this.title = title;
        this.artist = artist;
        this.duration = duration;
        this.createdAt = new Date().toISOString(); 
    }
}

export default Song;
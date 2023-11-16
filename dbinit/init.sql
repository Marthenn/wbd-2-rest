CREATE TABLE account (
    uid SERIAL PRIMARY KEY,
    is_admin boolean NOT NULL,
    username character varying NOT NULL check(length(username) >= 3 AND username ~* '^[A-Za-z0-9][A-Za-z0-9._]*$'),
    password character varying NOT NULL check(length(password) >= 8),
    email character varying NOT NULL check(email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    joined_date timestamp without time zone NOT NULL,
    expired_date timestamp without time zone NOT NULL
);

CREATE TABLE book (
    book_id SERIAL PRIMARY KEY,
    title character varying NOT NULL,
    description character varying NOT NULL,
    rating float, -- Rating between 0 and 5
    cover_image_directory character varying,
    duration character varying NOT NULL,
    author character varying NOT NULL,
    category character varying NOT NULL
);

CREATE TABLE chapter (
    chapter_id SERIAL PRIMARY KEY,
    chapter character varying NOT NULL,
    transcript_directory character varying,
    audio_directory character varying NOT NULL,
    book_id integer,
    FOREIGN KEY (book_id) REFERENCES book(book_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE favorite (
    favorite_id SERIAL PRIMARY KEY,
    uid integer,
    FOREIGN KEY (uid) REFERENCES account(uid) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE favorite_book (
    favorite_id integer NOT NULL,
    book_id integer NOT NULL,
    PRIMARY KEY (favorite_id, book_id),
    FOREIGN KEY (book_id) REFERENCES book(book_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (favorite_id) REFERENCES favorite(favorite_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE history (
    history_id integer NOT NULL PRIMARY KEY,
    uid integer,
    chapter_id integer,
    curr_duration character varying NOT NULL,
    FOREIGN KEY (uid) REFERENCES account(uid),
    FOREIGN KEY (chapter_id) REFERENCES chapter(chapter_id)
);

INSERT INTO account (is_admin, username, password, email, joined_date, expired_date)
VALUES
    (true, 'admin_user', 'admin_password123', 'admin@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '365 days'),
    (false, 'user1', 'user1_password', 'user1@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '365 days'),
    (false, 'user2', 'user2_password', 'user2@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '365 days');

INSERT INTO book (title, description, rating, cover_image_directory, duration, author, category)
SELECT
    'Book ' || generate_series,
    'Description for Book ' || generate_series,
    (random() * (5.0 - 0.0) + 0.0)::numeric(3,1), -- Random rating between 0.0 and 5.0 with one decimal place
    '/covers/book' || generate_series || '.jpg',
    '00:30:00', -- Varying duration between 5 and 24 hours
    'Author ' || (generate_series % 10 + 1),
    CASE
        WHEN generate_series % 3 = 0 THEN 'Fiction'
        WHEN generate_series % 3 = 1 THEN 'Mystery'
        ELSE 'Science Fiction'
    END
FROM generate_series(1, 20);

INSERT INTO chapter (chapter, transcript_directory, audio_directory, book_id)
SELECT
    'Chapter ' || (generate_series % 5) + 1 || ': Hello World!',
    '/transcripts/chapter' || generate_series || '.txt',
    '/audio/chapter' || generate_series || '.mp3',
    floor(generate_series / 5) + 1
FROM generate_series(0, 99);

INSERT INTO favorite (uid)
SELECT
    floor(random() * 3) + 1
FROM generate_series(1, 50);

INSERT INTO favorite_book (favorite_id, book_id)
SELECT
    generate_series,
    floor(random() * 20) + 1
FROM generate_series(1, 50);

INSERT INTO history (history_id, uid, chapter_id, curr_duration)
SELECT
    generate_series as history_id,
    floor(random() * 3) + 1 as uid,
    floor(random() * 100) + 1 as chapter_id,
    '00:30:00' as curr_duration
FROM generate_series(1, 20);
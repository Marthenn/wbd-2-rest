CREATE TABLE account (
    uid SERIAL PRIMARY KEY,
    is_admin boolean NOT NULL,
    username character varying NOT NULL check(length(username) >= 3 AND username ~* '^[A-Za-z0-9][A-Za-z0-9._]*$'),
    password character varying NOT NULL check(length(password) >= 8),
    email character varying NOT NULL check(email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    joined_date timestamp without time zone NOT NULL,
    expired_date timestamp without time zone NOT NULL,
    profile_pic_directory text
);

CREATE TABLE book (
    book_id SERIAL PRIMARY KEY,
    title character varying NOT NULL,
    description character varying NOT NULL,
    cover_image_directory character varying,
    duration character varying NOT NULL,
    author character varying NOT NULL,
    category character varying NOT NULL
);

CREATE TABLE chapter (
    chapter_id SERIAL PRIMARY KEY,
    chapter_name character varying NOT NULL,
    transcript text,
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

CREATE TABLE rating (
    rating_id SERIAL PRIMARY KEY,
    book_id integer,
    uid integer,
    rating real NOT NULL,
    FOREIGN KEY (book_id) REFERENCES book(book_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (uid) REFERENCES account(uid) ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO account (is_admin, username, password, email, joined_date, expired_date)
VALUES
    (true, 'admin_user', 'admin_password123', 'admin@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '365 days'),
    (false, 'user1', 'user1_password', 'user1@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '365 days'),
    (false, 'user2', 'user2_password', 'user2@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '365 days');

INSERT INTO book (title, description, cover_image_directory, duration, author, category)
SELECT
    'Book ' || generate_series,
    'Description for Book ' || generate_series,
    '/covers/book' || generate_series || '.jpg',
    (LPAD(floor(random() * 2)::text, 2, '0') || ':' || LPAD(floor(random() * 60)::text, 2, '0') || ':' || LPAD(floor(random() * 60)::text, 2, '0'))::time,  -- Random duration
    'Author ' || (generate_series % 10 + 1),
    CASE
        WHEN generate_series % 3 = 0 THEN 'Fiction'
        WHEN generate_series % 3 = 1 THEN 'Mystery'
        ELSE 'Science Fiction'
    END
FROM generate_series(1, 20);

INSERT INTO chapter (chapter_name, transcript, audio_directory, book_id)
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

INSERT INTO rating (book_id, uid, rating)
SELECT
    floor(random() * 20) + 1 as book_id,
    floor(random() * 3) + 1 as uid,
    (random() * 5)::numeric(3,1) as rating
FROM generate_series(1, 100);
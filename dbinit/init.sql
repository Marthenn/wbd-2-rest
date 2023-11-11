CREATE TABLE account (
    uid SERIAL PRIMARY KEY,
    is_admin boolean NOT NULL,
    username character varying NOT NULL check(length(username) >= 3 AND username ~* '^[A-Za-z0-9][A-Za-z0-9._]*$'),
    password character varying NOT NULL check(length(password) >= 8),
    email character varying NOT NULL check(email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    joined_date timestamp without time zone NOT NULL,
    expired_date timestamp without time zone NOT NULL
);

CREATE TABLE author (
    author_id SERIAL PRIMARY KEY,
    name character varying NOT NULL,
    description character varying
);

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name character varying NOT NULL UNIQUE
);

CREATE TABLE book (
    book_id SERIAL PRIMARY KEY,
    author_id integer,
    category_id integer,
    title character varying NOT NULL,
    description character varying NOT NULL,
    rating integer,
    cover_image_directory character varying,
    duration character varying NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES author(author_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE chapter (
    chapter_id SERIAL PRIMARY KEY,
    chapter integer NOT NULL,
    transcript_directory character varying,
    audio_directory character varying NOT NULL,
    book_id integer,
    FOREIGN KEY (book_id) REFERENCES book(book_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE face_id (
    facial_id character varying PRIMARY KEY,
    uid integer UNIQUE,
    FOREIGN KEY (uid) REFERENCES account(uid)
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
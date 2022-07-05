--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public.messages DROP CONSTRAINT messages_to_username_fkey;
ALTER TABLE ONLY public.messages DROP CONSTRAINT messages_from_username_fkey;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
ALTER TABLE ONLY public.messages DROP CONSTRAINT messages_pkey;
ALTER TABLE public.messages ALTER COLUMN id DROP DEFAULT;
DROP TABLE public.users;
DROP SEQUENCE public.messages_id_seq;
DROP TABLE public.messages;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    from_username text NOT NULL,
    to_username text NOT NULL,
    body text NOT NULL,
    sent_at timestamp with time zone NOT NULL,
    read_at timestamp with time zone
);


--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    username text NOT NULL,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    join_at timestamp without time zone NOT NULL,
    last_login_at timestamp with time zone
);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.messages (id, from_username, to_username, body, sent_at, read_at) FROM stdin;
1	username	user	Hello this is the first msg.	2022-07-04 15:29:08.107833-07	\N
2	Brad	bob	msg 1	2022-07-05 12:01:50.307786-07	\N
3	Braden	bob	msg 2	2022-07-05 12:02:03.975623-07	\N
4	bob	Braden	msg 3	2022-07-05 12:05:49.458747-07	\N
5	bob	Brad	msg 4	2022-07-05 12:06:05.436172-07	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (username, password, first_name, last_name, phone, join_at, last_login_at) FROM stdin;
username	password	Clair	Hawkes	555-5555	2022-07-04 15:25:15.79263	\N
user	pass	Jason	McVicar	555-5555	2022-07-04 15:26:56.592713	\N
Brad	$2b$12$PymqwqH/krSTK4DPgDFFjOregW/KckWBgyY1ZQxK1e3BVGSlvcRHO	Bob	Smith	+14150000000	2022-07-05 10:25:17.02494	2022-07-05 10:25:17.02494-07
Braden	$2b$12$IoZ/Zx5cjTqtfrm3z3EJ1.lY1uDhA6SKSZxdNBa4.5/LAP0hkrS26	Bob	Smith	+14150000000	2022-07-05 10:38:23.47994	2022-07-05 10:38:23.47994-07
bob	$2b$12$ULlRKWIeZMcvIFG3QCx4wOAvSk6EpQAqH4qrM4HRTSedGL9sMbMCu	Bob	Smith	+14150000000	2022-07-05 10:23:16.740536	2022-07-05 10:53:07.150129-07
\.


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.messages_id_seq', 5, true);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (username);


--
-- Name: messages messages_from_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_from_username_fkey FOREIGN KEY (from_username) REFERENCES public.users(username);


--
-- Name: messages messages_to_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_to_username_fkey FOREIGN KEY (to_username) REFERENCES public.users(username);


--
-- PostgreSQL database dump complete
--


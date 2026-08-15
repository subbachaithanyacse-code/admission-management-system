--
-- PostgreSQL database dump
--

\restrict c1ePIKGfJ60DmjlGMhhvaGDFXBd5msAosd7qgeFGQGDi7KUUWekmclqYS8EoYPS

-- Dumped from database version 17.10
-- Dumped by pg_dump version 17.10

-- Started on 2026-08-15 14:57:15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16423)
-- Name: admissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admissions (
    id integer NOT NULL,
    student_id integer,
    course_id integer,
    admission_date date,
    status character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.admissions OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16422)
-- Name: admissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admissions_id_seq OWNER TO postgres;

--
-- TOC entry 4895 (class 0 OID 0)
-- Dependencies: 221
-- Name: admissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admissions_id_seq OWNED BY public.admissions.id;


--
-- TOC entry 220 (class 1259 OID 16409)
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    course_name character varying(100) NOT NULL,
    duration character varying(50),
    fee numeric(10,2),
    seats integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    course_code character varying(20)
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16408)
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courses_id_seq OWNER TO postgres;

--
-- TOC entry 4896 (class 0 OID 0)
-- Dependencies: 219
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- TOC entry 218 (class 1259 OID 16391)
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    id integer NOT NULL,
    fullname character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(15),
    course character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.students OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16390)
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.students_id_seq OWNER TO postgres;

--
-- TOC entry 4897 (class 0 OID 0)
-- Dependencies: 217
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- TOC entry 224 (class 1259 OID 16441)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'admin'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16440)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4898 (class 0 OID 0)
-- Dependencies: 223
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4714 (class 2604 OID 16426)
-- Name: admissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admissions ALTER COLUMN id SET DEFAULT nextval('public.admissions_id_seq'::regclass);


--
-- TOC entry 4712 (class 2604 OID 16412)
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- TOC entry 4710 (class 2604 OID 16394)
-- Name: students id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- TOC entry 4716 (class 2604 OID 16444)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4887 (class 0 OID 16423)
-- Dependencies: 222
-- Data for Name: admissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admissions (id, student_id, course_id, admission_date, status, created_at) FROM stdin;
5	5	7	2026-07-15	Approved	2026-07-30 10:38:23.345395
6	2	5	2026-07-15	Approved	2026-07-30 13:12:29.385009
7	9	11	2026-06-09	Approved	2026-07-30 13:45:16.979441
2	2	3	2026-07-29	Rejected	2026-07-29 13:27:52.031922
10	3	3	2026-08-07	Approved	2026-08-07 11:47:33.595872
11	12	9	2026-08-20	Approved	2026-08-07 12:00:48.232391
12	13	8	2026-08-20	Approved	2026-08-07 13:52:39.341298
13	17	7	2026-08-25	Approved	2026-08-07 14:24:41.274692
14	18	10	2026-08-25	Approved	2026-08-11 09:58:00.368037
15	5	11	2026-08-11	Approved	2026-08-11 10:00:57.765058
16	24	7	2026-08-12	Approved	2026-08-11 10:10:23.599434
17	16	11	2026-08-19	Approved	2026-08-11 15:09:29.37531
\.


--
-- TOC entry 4885 (class 0 OID 16409)
-- Dependencies: 220
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (id, course_name, duration, fee, seats, created_at, course_code) FROM stdin;
8	cse	2 	50000.00	5	2026-07-30 10:35:12.146178	CSE-01
9	B.Tech	4	55000.00	66	2026-07-30 10:37:45.778301	BTECH-04
10	CSE	4	49990.00	3	2026-07-30 13:12:03.173181	CSE-02
11	Mtech	2 Years	80000.00	5	2026-07-30 13:44:31.775086	MTECH-01
7	B.Tech	4 years	55000.00	60	2026-07-29 13:22:04.687691	BTECH-03
12	CSE	4 Years	400000.00	366	2026-07-30 13:51:56.33103	CSE-03
13	B,Tech	4	80000.00	1	2026-08-07 14:16:25.697147	BTECH-05
5	B,Tech	4 Years	300000.00	60	2026-07-29 11:10:41.846303	BTECH-02
14	B,>tech	4	50000.00	1	2026-08-08 15:11:05.750194	BTECH-06
15	B,Tech	4	550000.00	1	2026-08-11 09:57:37.855177	BTECH-07
16	B,Tech	4	55500000.00	6	2026-08-11 10:00:34.227394	BTECH-08
17	B,Tech	4	666990.00	5	2026-08-11 10:10:00.848909	BTECH-09
18	CSE	4	50000.00	60	2026-08-11 19:13:05.650917	CSE-1
3	B.Tech	4 Years	250000.00	7	2026-07-27 11:04:29.110167	BTECH-01
\.


--
-- TOC entry 4883 (class 0 OID 16391)
-- Dependencies: 218
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, fullname, email, phone, course, created_at) FROM stdin;
3	Ravi	ravi@gmail.com	9876543210	cse	2026-07-27 19:02:42.184526
9	sunitha	sunitha@gmail.com	998592445567	CSE	2026-07-30 13:11:33.772888
10	Chaitanaya	chaitu@gmail.com	6789098756	MTech	2026-07-30 13:43:35.476579
5	ujwal	ujwal@gmail.com	1234567	Btech	2026-07-28 22:03:55.522949
11	Chaithu	Chaithu@gmail.com	1234567892	MCA	2026-07-30 13:51:13.799598
12	Teja	Teja@gmail.com	09177739362	CSE	2026-08-04 22:44:26.095467
13	Rajini	Rajini@gmail.com	09177739362	CSE	2026-08-04 23:13:54.722258
14	mouli 	mouli@gmail.com	09177739362	CSE	2026-08-05 12:24:32.78534
6	vaibhav	vaibhav@gmail.com	123456789	cse	2026-07-28 22:08:14.362021
15	Deepika	deeps@123	6666666	cse	2026-08-06 10:18:45.267049
16	DEEPS	Deeps@345	677578	cse	2026-08-06 16:29:58.442784
17	yuvansh	yuvansh@gmail.com	09177739362	1	2026-08-07 11:33:18.792067
18	chandra mouli reddy	chandra@gmail.com	09177739362	CSE	2026-08-07 14:12:52.54367
2	Chaithanya Reddy	chaithanya@gmail.com	9876543210	cse	2026-07-26 18:31:50.277263
19	sirisha	sirisha@gmail.com	9988675432	CSE	2026-08-08 15:10:17.305036
20	B SUBBACHAITHANYA	subbachaithanya.cse@srit.ac.in	09985924446	CSE	2026-08-10 11:29:38.959364
22	yuvansh Reddy	yuvansh123@gmail.com	9948044915	CSE	2026-08-11 09:57:11.39685
23	xyz	xyz@gmail.com	55544555555	CSE	2026-08-11 10:00:03.395357
24	reddy	reddy123@gmail.com	7656677666	CSE	2026-08-11 10:09:43.098656
25	Deeps	deeps@gmail.com	5678966543	cse	2026-08-11 15:08:21.443308
26	pavani	pavani@gmail.com	123456789	cse	2026-08-11 19:12:30.799205
8	Deepika	Deepika@gmail.com	8976589087	ece	2026-07-30 10:36:15.930495
\.


--
-- TOC entry 4889 (class 0 OID 16441)
-- Dependencies: 224
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, role, created_at) FROM stdin;
1	admin	admin123	admin	2026-08-07 14:33:02.70117
\.


--
-- TOC entry 4899 (class 0 OID 0)
-- Dependencies: 221
-- Name: admissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admissions_id_seq', 17, true);


--
-- TOC entry 4900 (class 0 OID 0)
-- Dependencies: 219
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courses_id_seq', 19, true);


--
-- TOC entry 4901 (class 0 OID 0)
-- Dependencies: 217
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_id_seq', 26, true);


--
-- TOC entry 4902 (class 0 OID 0)
-- Dependencies: 223
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- TOC entry 4728 (class 2606 OID 16429)
-- Name: admissions admissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admissions
    ADD CONSTRAINT admissions_pkey PRIMARY KEY (id);


--
-- TOC entry 4730 (class 2606 OID 16452)
-- Name: admissions admissions_student_course_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admissions
    ADD CONSTRAINT admissions_student_course_unique UNIQUE (student_id, course_id);


--
-- TOC entry 4724 (class 2606 OID 16454)
-- Name: courses courses_course_code_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_course_code_unique UNIQUE (course_code);


--
-- TOC entry 4726 (class 2606 OID 16415)
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- TOC entry 4720 (class 2606 OID 16399)
-- Name: students students_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_email_key UNIQUE (email);


--
-- TOC entry 4722 (class 2606 OID 16397)
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- TOC entry 4732 (class 2606 OID 16448)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4734 (class 2606 OID 16450)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4735 (class 2606 OID 16435)
-- Name: admissions admissions_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admissions
    ADD CONSTRAINT admissions_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- TOC entry 4736 (class 2606 OID 16430)
-- Name: admissions admissions_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admissions
    ADD CONSTRAINT admissions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


-- Completed on 2026-08-15 14:57:15

--
-- PostgreSQL database dump complete
--

\unrestrict c1ePIKGfJ60DmjlGMhhvaGDFXBd5msAosd7qgeFGQGDi7KUUWekmclqYS8EoYPS


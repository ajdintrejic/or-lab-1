--
-- PostgreSQL database dump
--

-- Dumped from database version 12.4
-- Dumped by pg_dump version 12.4

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: distribucije_linuxa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.distribucije_linuxa (
    distributionname character varying(32) NOT NULL,
    basename character varying(32) NOT NULL,
    releasetype character varying(32) NOT NULL,
    packagemanager character varying(32) NOT NULL,
    supportedarch character varying(32) NOT NULL,
    yearofcreation character varying(4),
    homepage character varying(64),
    distrowatchrank smallint,
    targetuse character varying(32),
    supportedde character varying(16)[],
    wikipage character varying(32)
);


ALTER TABLE public.distribucije_linuxa OWNER TO postgres;

--
-- Data for Name: distribucije_linuxa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.distribucije_linuxa (distributionname, basename, releasetype, packagemanager, supportedarch, yearofcreation, homepage, distrowatchrank, targetuse, supportedde, wikipage) FROM stdin;
ManjaroLinux	ArchLinux	rolling release	pacman	x86, x64, ARM (some devices)	2011	https://manjaro.org	2	general	{"KDE Plasma",Gnome,XFCE}	Manjaro
ArchLinux	independent	rolling release	pacman	x64	2002	https://archlinux.org	15	general	{}	Arch_Linux
Fedora	independent	point release	dnf	x64	2003	https://getfedora.org	8	general, server	{"KDE Plasma",Gnome,XFCE,LXQt,MATE,Cinnamon,LXDE,SOAS}	Fedora_(operating_system)
Qubes OS	independent	point release	dnf	x64	2012	https://qubes-os.org	96	general, security, privacy	{"KDE Plasma",XFCE}	Qubes_OS
Ubuntu	Debian	point release	apt	x64	2004	https://ubuntu.com	4	general, server	{"KDE Plasma",Gnome,XFCE,DeepinDE,LXQt,Budgie,Mate}	Ubuntu
Debian	independent	point release	apt	x86, x64	1993	https://debian.org	6	general, server	{"KDE Plasma",Gnome,XFCE,Cinnamon,MATE,LXDE,LXQt}	Debian
ElementaryOS	Ubuntu	point release	apt	x64	2011	https://elementry.io	7	general	{Pantheon}	Elementary_OS
Kali Linux	Debian	point release	apt	x86, x64, ARM (some devices)	2013	https://kali.org	23	cybersecurity, pentesting	{XFCE}	Kali_Linux
Pop!_OS	Ubuntu	point release	apt	x64	2017	https://system76.com/pop	5	general	{Gnome}	Pop!_OS
Linux Mint	Ubuntu	point release	apt	x64	2006	https://linuxmint.com	3	general	{Cinnamon,XFCE,MATE}	Linux_Mint
\.


--
-- Name: distribucije_linuxa distribucije_linuxa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.distribucije_linuxa
    ADD CONSTRAINT distribucije_linuxa_pkey PRIMARY KEY (distributionname);


--
-- PostgreSQL database dump complete
--


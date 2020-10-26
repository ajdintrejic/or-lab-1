# or-lab-1

## License

Creative Commons — Attribution 2.0 Generic
[More](https://creativecommons.org/licenses/by/4.0/legalcode)

## Author

Ajdin Trejić

## Version

v1.0

## Language

English

## Attributes
- distributionName
- baseName
- releaseType
- packageManager
- supportedArch
- yearOfCreation
- homepage
- distrowatchRank (last 6 months)
- targetUse 
- supportedDE

## How To

### Setup psql
```
$ sudo dnf install postgresql postgresql-server # install client/server
$ sudo postgresql-setup initdb                  # initialize PG cluster
$ sudo systemctl start postgresql               # start cluster
$ sudo -iu postgres				# login as postgres
$ psql						# enter psql
```

### Create a db, and commect to it.
```
CREATE DATABASE orlab1;
\c orlab1
```

### Create a table and add data
```
CREATE TABLE distribucije_linuxa (
   distributionName VARCHAR(32) PRIMARY KEY,
   baseName VARCHAR(32) NOT NULL,
   releaseType VARCHAR(32) NOT NULL,
   packageManager VARCHAR(32) NOT NULL,
   supportedArch VARCHAR(32) NOT NULL,
   yearOfCreation VARCHAR(4),
   homepage VARCHAR(64),
   distrowatchRank SMALLINT,
   targetUse VARCHAR(32),
   supportedDE VARCHAR(16)[],
   wikiPage VARCHAR(32)
);

INSERT INTO distribucije_linuxa 
(distributionName, baseName, releaseType, packageManager, supportedArch, yearOfCreation, homepage, distrowatchRank, targetUse, supportedDE, wikiPage) VALUES
('ManjaroLinux', 'ArchLinux', 'rolling release', 'pacman', 'x86, x64, ARM (some devices)', '2011', 'https://manjaro.org', 2, 'general', '{"KDE Plasma", "Gnome", "XFCE"}', 'Manjaro');

INSERT INTO distribucije_linuxa 
(distributionName, baseName, releaseType, packageManager, supportedArch, yearOfCreation, homepage, distrowatchRank, targetUse, supportedDE, wikiPage) VALUES
('ArchLinux', 'independent', 'rolling release', 'pacman', 'x64', '2002', 'https://archlinux.org', 15, 'general', '{}', 'Arch_Linux');

INSERT INTO distribucije_linuxa 
(distributionName, baseName, releaseType, packageManager, supportedArch, yearOfCreation, homepage, distrowatchRank, targetUse, supportedDE, wikiPage) VALUES
('Fedora', 'independent', 'point release', 'dnf', 'x64', '2003', 'https://getfedora.org', 8, 'general, server', '{"KDE Plasma", "Gnome", "XFCE", "LXQt", "MATE", "Cinnamon", "LXDE", "SOAS"}', 'Fedora_(operating_system)');

INSERT INTO distribucije_linuxa 
(distributionName, baseName, releaseType, packageManager, supportedArch, yearOfCreation, homepage, distrowatchRank, targetUse, supportedDE, wikiPage) VALUES
('Qubes OS', 'independent', 'point release', 'dnf', 'x64', '2012', 'https://qubes-os.org', 96, 'general, security, privacy', '{"KDE Plasma", "XFCE"}', 'Qubes_OS');

INSERT INTO distribucije_linuxa 
(distributionName, baseName, releaseType, packageManager, supportedArch, yearOfCreation, homepage, distrowatchRank, targetUse, supportedDE, wikiPage) VALUES
('Ubuntu', 'Debian', 'point release', 'apt', 'x64', '2004', 'https://ubuntu.com', 4, 'general, server', '{"KDE Plasma", "Gnome", "XFCE", "DeepinDE", "LXQt", "Budgie", "Mate"}', 'Ubuntu');

INSERT INTO distribucije_linuxa 
(distributionName, baseName, releaseType, packageManager, supportedArch, yearOfCreation, homepage, distrowatchRank, targetUse, supportedDE, wikiPage) VALUES
('Debian', 'independent', 'point release', 'apt', 'x86, x64', '1993', 'https://debian.org', 6, 'general, server', '{"KDE Plasma", "Gnome", "XFCE", "Cinnamon", "MATE", "LXDE", "LXQt" }', 'Debian');

INSERT INTO distribucije_linuxa 
(distributionName, baseName, releaseType, packageManager, supportedArch, yearOfCreation, homepage, distrowatchRank, targetUse, supportedDE, wikiPage) VALUES
('ElementaryOS', 'Ubuntu', 'point release', 'apt', 'x64', '2011', 'https://elementry.io', 7, 'general', '{"Pantheon"}', 'Elementary_OS');

INSERT INTO distribucije_linuxa 
(distributionName, baseName, releaseType, packageManager, supportedArch, yearOfCreation, homepage, distrowatchRank, targetUse, supportedDE, wikiPage) VALUES
('Kali Linux', 'Debian', 'point release', 'apt', 'x86, x64, ARM (some devices)', '2013', 'https://kali.org', 23, 'cybersecurity, pentesting', '{"XFCE"}', 'Kali_Linux');

INSERT INTO distribucije_linuxa 
(distributionName, baseName, releaseType, packageManager, supportedArch, yearOfCreation, homepage, distrowatchRank, targetUse, supportedDE, wikiPage) VALUES
('Pop!_OS', 'Ubuntu', 'point release', 'apt', 'x64', '2017', 'https://system76.com/pop', 5, 'general', '{"Gnome"}', 'Pop!_OS');

INSERT INTO distribucije_linuxa 
(distributionName, baseName, releaseType, packageManager, supportedArch, yearOfCreation, homepage, distrowatchRank, targetUse, supportedDE, wikiPage) VALUES
('Linux Mint', 'Ubuntu', 'point release', 'apt', 'x64', '2006', 'https://linuxmint.com', 3, 'general', '{"Cinnamon", "XFCE", "MATE"}', 'Linux_Mint');
```

### Export to CSV
First export to /tmp, and copy to working directory.
```
COPY distribucije_linuxa TO '/tmp/distribucije_linuxa.csv' DELIMITER ',' CSV HEADER;
cp /tmp/distribucije_linuxa.csv .                         
```

### Export to JSON
```
SELECT array_to_json(array_agg(row_to_json (r))) FROM (SELECT * FROM distribucije_linuxa) r; 
```
Copy output and paste it in `distribucije_linuxa.json`.

#### Pretty print using Python
```
cat distribucije_linuxa.json| python -m json.tool > distribucije_linuxa_pretty_print.json
```


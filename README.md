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


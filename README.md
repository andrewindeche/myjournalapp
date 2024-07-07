# JOURNALING APP

|Tool                | Description                    | Tags for tools used                                                                                               |
| ------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| 1.GitHub| Version Control| [Version-Control]; [Repo];|
| 2.React Native| Native FrontEnd Framework| [Typescript]; [Mobile Device];|
| 3.Django |  Python Based Backend Framework| [python]; [Django];|
| 4.ESLint| Linting Framework| [Lint]; [syntax];|
| 5.PostgresQl | Relational Database| [Relational Integrity]; [Database];|
| 6.Docker | Ocntainerization/Virtulization| [Virtualization]; [Containers];|
| 7.Metro | Native Bundler| [Bundle];|
| 8.Pipenv | Package/Dependency manager| [Virtual Environment];[Dependency];|
| 9.Circleci | Pipeline| [continuous integration];[continuous delivery];|

## <h1> Description</h1>
<p>The aim of the project is to build a journaling app using React Native for frontend and Python Django web for backend </p>
<p>The project enables Users should be able to write journal entries, categorize them, and view a summary of their entries.</p>

## <h1> Set up Instructions</h1>
<p><b>Github</b></p>
<ul>
<li> Download the Zip file from the code tab on github to get the project Zip files (Recommended)</li>
<li> Clone the project using 'git clone https://github.com/yourusername/yourproject.git'.</li>
<li> Unzip the file and add the Project folder to your IDE/Compiler</li>
</ul>

<p><b>Docker</b></p>
Python 3.10.12 Django==5.0.6

1. Create an .env environment on the Django root folder and add the recessary environment variables. 
Use <b>backend\env.example</b> as a guide for environment variables.

2. Use Postgresql user if you want to create new postgres credentials in docker, use the command: 

```bash
docker-compose up -d 
```
3. To verify postgres and db existance :

```bash
docker exec -it <container_name> psq
```

4. Start the docker db service and copy the dump files into the container using the command:

```bash
docker-compose up -d db
```

 5. To Load the data for data fixtures use:

```bash
docker-compose exec backend python manage.py loaddata initial_data.json
```

6. To build a new container Use the command:

```bash
docker compose build
```

7. To start the container:

```bash
docker compose up
``` 

8. To execute both build and start actions use:

```bash
docker compose up --build
``` 

9. Access the Django development server on:

<b>http://localhost:8000/</b> 

and expo server 

<b>http://localhost:8081</b</li>


<p><b>Django</b></p>


<p>The project uses pipenv, django and postgresql backend</p>

1. Install pipenv using the command 

```bash
pip install pipenv
```

2. Activate your virtual enviromnment

```bash
pipenv shell 
```

3. Naviagte to your Django project and use  in  the directory path: <b>backend\requirements.txt</b> to install the required django dependencies 

```bash
pipenv install -r requirements.txt
```

4. Create an .env on the Django root folder and add the recessary environment variables. 

Use (backend\env.example) as a guide for environment variables </li>

5. Create a Super User using 

```bash
python manage.py createsuperuser
```

6. Migrate your DB using 

```bash
python manage.py migrate
```

7. To run the project outside of a shell environment use: 

```bash
pipenv run python manage.py runserver
```

 or while in the shell environment use:

```bash
python manage.py runserver
```

<p><b>React Native</b></p>
<p>The project using React Native for frontend development</p>

node v21.4.0 (npm v10.2.4)

1. Install the required dependencies using the commands 

```bash
npm install
```

2. Start the Development server using the command 


```bash
npx react-native start
```

3. Open the server using the link : 

<b>http://localhost:8081</b>

## <h1> Endpoints</h1>

1. Logging in:
<p><b>http://localhost:8081/api/login/</b></p>

2. Signing up:

<p><b>http://localhost:8081/api/register/</b></p>

3. Bio update:

<p><b>http://localhost:8081/api/profile/update/bio/</b></p>

4. Profile Image Update:

<p><b>http://localhost:8081/api/profile/update/profile-image/</b></p>

5.Password change:

<p><b>http://localhost:8081/api/profile/update/password-change/</b></p>

6. Create journal entries:

<p><b>http://localhost:8081/api/entries/create/</b></p>

7. Retrieve, update or delete journal entries:

<p><b>http://localhost:8081/api/entries/<int:pk>/edit/ </b></p>

8. Create categories:

<p><b>http://localhost:8081/api/entries/create/</b></p>

9. Retrieve, update or delete categories:

<p><b>http://localhost:8081/api/categories/<int:pk>/edit/</b></p>

## <h1> Endpoints</h1>
Built by <b>Andrew Indeche</b>
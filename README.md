# JOURNALING APP

|Tool                | Description                    | Tags for tools used                                                                                               |
| ------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| 1.GitHub| Version Control| [Version-Control]; [Repo];|
| 2.React Native| Native FrontEnd Framework| [Typescript]; [Mobile Device];|
| 3.Django |  Python Based Backend Framework| [python]; [Django];|
| 4.ESLint| Linting Framework| [Lint]; [syntax];|
| 5.PostgresQl | Relational Database| [Relational Integrity]; [Database];|
| 6.Docker | Ocntainerization/Virtulization| [Virtualization]; [Containers];|
| 7.Expo | Native Bundler| [Bundle];|
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
<ul>
<li> Create an .env environment on the Django root folder and add the recessary environment variables. 
Use <b>backend\env.example</b> as a guide for environment variables </li>
<li>Use Postgresql user if you want to create new postgres credentials in docker, use the command <b>docker-compose up -d </b> and <b>docker exec -it <container_name> psq</b> to verify postgres and db existance </li>
<li>Start the docker db service using the command <b>docker-compose up -d db</b> and copy the dump files into the container, Load the data </li>
<li> For data fixtures use <b>docker-compose exec backend python manage.py loaddata initial_data.json
</b></li>
<li>Use the command <b>docker compose build</b> to build a new container, <b>docker compose up</b> to start the container or <b>docker compose up --build</b> to execute both build and start actions </li>
<li> Access the Django development server on <b>http://localhost:8000/</b> and expo server <b>http://localhost:8081</b</li>
</ul>

<p><b>Django</b></p>
<p>The project uses pipenv, django and postgresql backend</p>
<ul>
<li> Install pipenv using the command <b>pip install pipenv</b></li>
<li> Use <b>pipenv shell</b> to activate your virtual enviromnment</li>
<li> Naviagte to your Django project and use <b>pipenv install -r requirements.txt</b> in 
<b>backend\requirements.txt</b> to install the required django dependencies </li>
<li> Create a .env on the Django root folder and add the recessary environment variables. 
Use [Your Link Text](backend\env.example) as a guide for environment variables </li>
<li> Create a Super User using <b>python manage.py createsuperuser</b> and migrate your DB using <b>python manage.py migrate</b></li>
<li> Use <b>pipenv run python manage.py runserver</b> To run the project outside of a shell environment or <b>python manage.py runserver</b> while in the shell.
</ul>

<p><b>React Native</b></p>
<p>The project using React Native for frontend development</p>
<ul>
<li>Install the required dependencies using the commands <b>yarn install or npm install</b></li>
<li>Start the Development server using the command <b>npx react-native start</b></li>
<li>Open the server using the link <b>http://localhost:8081</b></li>
</ul>

## <h1> Endpoints</h1>

## <h1> Endpoints</h1>
Built by <b>Andrew Indeche  </b>
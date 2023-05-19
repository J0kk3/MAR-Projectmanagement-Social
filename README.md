# MAR-Projectmanagment-Social

### MongoDB, ASP.NET Core & React.js
<hr/>

This project is using the Clean Architecture, and is split up into several "layers". Each layer have their own Readme.md.

## Created using the following in powershell:</br>

Write-Host "About to Create the directory" -ForegroundColor Green

mkdir Reactivities</br>
cd Reactivities</br>

Write-Host "About to create the solution and projects" -ForegroundColor Green</br>
dotnet new sln</br>
dotnet new webapi -n API</br>
dotnet new classlib -n Application</br>
dotnet new classlib -n Domain</br>
dotnet new classlib -n Persistence</br>

Write-Host "Adding projects to the solution" -ForegroundColor Green</br>
dotnet sln add API/API.csproj</br>
dotnet sln add Application/Application.csproj</br>
dotnet sln add Domain/Domain.csproj</br>
dotnet sln add Persistence/Persistence.csproj</br>

Write-Host "Adding project references" -ForegroundColor Green</br>
cd API</br>
dotnet add reference ../Application/Application.csproj</br>
cd ../Application</br>
dotnet add reference ../Domain/Domain.csproj</br>
dotnet add reference ../Persistence/Persistence.csproj</br>
cd ../Persistence</br>
dotnet add reference ../Domain/Domain.csproj</br>
cd ..</br>

Write-Host "Executing dotnet restore" -ForegroundColor Green</br>
dotnet restore</br>

Write-Host "Finished!" -ForegroundColor Green</br>
<hr/>
#To run: </br>
cd into API then run this command:</br>

```
dotnet watch --no-hot-reload
```

and cd into client-app then run this command:

```
npm start
```

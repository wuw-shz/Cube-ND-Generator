@echo off

call npm ls typescript > nul 2>&1
if %errorlevel% neq 0 (
    call npm i --save-dev typescript -g
    echo Install TypeScript successfully ✅
) else (
    echo TypeScript already installed 🔃
)
call npm ls @minecraft/server > nul 2>&1
if %errorlevel% neq 0 (
    call npm i @minecraft/server@1.9.0-beta.1.20.60-stable
    echo Install Minecraft Server successfully ✅
) else (
    echo Minecraft Server already installed 🔃
)
call npm ls @minecraft/server-ui > nul 2>&1
if %errorlevel% neq 0 (
    call npm i @minecraft/server-ui@1.2.0-beta.1.20.10-stable
    echo Install Minecraft Server UI successfully ✅
) else (
    echo Minecraft Server UI already installed 🔃
)

if not exist pack_icon.png (
   powershell -command "& {Invoke-WebRequest 'https://wuwsh.tech/pack_icon.png' -OutFile 'pack_icon.png'}"
)

for %%a in (.) do set CurrDirName=%%~nxa
for /f %%a in ('powershell -command "$([guid]::NewGuid().ToString())"') do ( set main_uuid=%%a )
for /f %%a in ('powershell -command "$([guid]::NewGuid().ToString())"') do ( set script_uuid=%%a )

if not exist manifest.json (
    (
        echo {
        echo   "format_version": 2,
        echo   "header": {
        echo     "name": "%CurrDirName%",
        echo     "description": "@wuw.sh",
        echo     "min_engine_version": [1, 20, 60],
        echo     "uuid": "%main_uuid: =%",
        echo     "version": [1, 0, 0]
        echo   },
        echo   "modules": [
        echo     {
        echo       "type": "script",
        echo       "language": "javascript",
        echo       "uuid": "%script_uuid: =%",
        echo       "entry": "scripts/server/index.js",
        echo       "version": [1, 0, 0]
        echo     }
        echo   ],
        echo   "dependencies": [
        echo     {
        echo       "module_name": "@minecraft/server",
        echo       "version": "1.9.0-beta"
        echo     }
        echo   ]
        echo }
    ) > manifest.json
)

if not exist tsconfig.json (
    (
        echo {
        echo   "compilerOptions": {
        echo     "module": "ES2020",
        echo     "target": "ES2021",
        echo     "moduleResolution": "Node",
        echo     "allowSyntheticDefaultImports": true,
        echo     "baseUrl": "./src",
        echo     "rootDir": "./src",
        echo     "outDir": "./scripts",
        echo     "strict": true,
        echo     "forceConsistentCasingInFileNames": true,
        echo   },
        echo   "exclude": [ "node_modules" ],
        echo   "include": [ "src" ]
        echo }
    ) > tsconfig.json
)

if not exist compiler.bat (
    (
        echo @echo off
        echo call tsc -w
    ) > compiler.bat
)

if not exist src (
    call mkdir src
    cd src
    call mkdir server
    cd server
    call echo // index.ts > index.ts
)
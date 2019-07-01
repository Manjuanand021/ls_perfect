# LifeSuite with Angular and CLI(Command Line Interface)

Note: All NodeJS commands in NodeJS Command Prompt should be run from the [Angular UI Root Folder], 
	which is UI\HTML5\LifeSuite.Angular for this application.
======================================================================================================

## Getting Started

How to install Angular/TypeScript part of the project:

	1. Install NodeJS from http://nodejs.org/. This provides the platform on which the build tooling runs.
		
		Currently Angular project requires NodeJS v8.12.0 or higher.  NodeJS v8 comes with NPM v5.4
	
	2. Open NodeJS command prompt, change directory to [Angular UI Root Folder]
	
	3. Note: This step is only needed if you need to UPGRADE NPM to a later version. To do this, run command:
		npm install npm -g
		
		Currently Angular project requires NPM 5 or higher.
		
	4. Install ANGULAR-CLI by running command:
		npm install -g @angular/cli@[version]

		where [version] value will come from the version of angular-cli in the file package.json.
		For example, if in package.json angular-cli is defined as:
		 "devDependencies": {
			...
			"@angular/cli": "1.1.0",
			...
		},
		then the install command will be:
			npm install -g @angular/cli@1.1.0 


	5. Install the project by running command:  
		npm install
		
	
How to resolve possible issues:

ERROR:
	Module build failed: Error: ENOENT: no such file or directory, scandir 'C:\Accelerate\LifeSuiteAngular4\UI\HTML5\LifeSuite.Web\node_modules\node-sass\vendor'
RESOLUTION:
	Run the following command:
		npm rebuild node-sass
		
======================================================================================================

## How to Run Locally when you work on UI:

	1. Open file UI\HTML5\LifeSuite.Web\appsettings.json and change port to 4200 (in 3 places);
	
	2. Launch solution in VisualStudio 2017;

	1. Open NodeJS command prompt, change current directory to [Angular UI Root Folder]
	
	2. Run command:
		npm start

	3. Navigate web browser to `http://localhost:4200/`. 
	   The app will automatically recompile when you change any TypeScript or css source files.

======================================================================================================

## How to Build Angular UI for Deployment:

	1. Open NodeJS command prompt, change current directory to [UI Root Folder]

	2. Run command: 
		npm run build:prod
		
		The build artifacts will be stored in the UI\HTML5\LifeSuite.Web\wwwroot\ folder.

		Note: 
			For production, the base folder in index.html should be set to <base href="./"> .
			To change base folder for deployment, use '--base-href' flag:
				ng build -prod --base-href ./
			This woudl change <base href="./"> inside index.html

	3. Test by navigating browser to the local IIS site root, for example:
		http://localhost/lifesuite/index.html

======================================================================================================

## How to adjust build configuration settings in angular.json :
Use the following configuration settings for production build for delivery to client:
                    "configurations": {
                        "prod-en-us": {
                            "optimization": true,
                            "outputHashing": "all",
                            "sourceMap": false,		// set to true to allow for JS debugging 
                            "extractCss": true,
                            "namedChunks": false,
                            "aot": true,
                            "extractLicenses": true,
                            "vendorChunk": true,
                            "buildOptimizer": true,
							. . .
						}
Use the following configuration settings for production build for QA sites (with minimized build time, etc) :
                    "configurations": {
                        "prod-en-us": {
                            "optimization": false,
                            "outputHashing": "all",
                            "sourceMap": true,		// set to true to allow for JS debugging 
                            "extractCss": true,
                            "namedChunks": true,
                            "aot": true,
                            "extractLicenses": false,
                            "vendorChunk": true,
                            "buildOptimizer": true,
							. . .
						}

Note: see all build options explained here: https://github.com/angular/angular-cli/wiki/build

======================================================================================================
							
## How to analyze prod bundles:

Follow below instructions to analyze prod bundles:
	1. Create prod build using below command, which creates build under UI\HTML5\LifeSuite.Web\wwwroot\ folder.
		npm run gen-status - creates prod build with ahead of time compilation and generates source maps, stats.json file

	2. Run source-map-explorer tool using below command.
		npm run sme {UI\HTML5\LifeSuite.Web\wwwroot\#bundle_to_analyze}  

		This opens browser with a treemap visualization of production bundles to help you analyze/debug where all the code is coming from.  

	3. Alternate way to analyze bundles. Run webpack-bundle-analyzer tool using below command.
		npm run gen-report {UI\HTML5\LifeSuite.Web\wwwroot\stats.json} - visualize size of webpack output files with an interactive zoomable treemap.



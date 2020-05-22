import * as fs from 'fs';
import * as program from 'commander';

function list(val: string): string[] {
    return val.split(',')
}

program
    .option("-e, --environment <string>", "App environment")
    .option("-p, --params <items>", "An list of app environment and bamboo build number, e.g.: dev", list)
    .parse(process.argv);

console.log('Replacing environments ...');

/*
params:
0: environment,
1: mongodb host
2: mongodb port
3: mongodb account
4: mongodb password
*/

if (program.params) {
    //program.params[0]
    replaceEnv([
        "config/config.json"
    ],
        {
            "env": program.params[0],
            "dbHost": program.params[1],
            "dbPort": program.params[2],
            "dbUser": program.params[3],
            "dbPsd": program.params[4],

        }
    );
} else {
    console.error('There is no params from config file or bamboo server!')
}

function replaceEnv(filesList: any[], params: object) {
    filesList.forEach((file): void => {
        let result = fs.readFileSync(file).toString();
        for (let key in params) {
            let r = "\\${" + key + "}";
            result = result.replace(new RegExp(r, "g"), params[key]);
        }

        fs.writeFileSync(file, result)
    });
}
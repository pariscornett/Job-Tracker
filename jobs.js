//dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");

//setup db connection specifics
const connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "HoloGraph4!$",
    database: "jobs_DB"
});

//establish connection to db
connection.connect(function(err) {
    if (err) throw err;
    console.log("🌐 connected as id " + connection.threadId + "\n");
    mainMenu();
});

//initial inquiry
const mainMenu = () => {
    inquirer
        .prompt({
            name: "choice",
            type: "list",
            message: "Select one: ",
            choices: [
                "Add a new job application",
                "Review all job applications",
                "Update a job application",
                "Delete a job application",
                "Exit"
            ]
        })
        .then(function(answer) {
            switch(answer.choice) {
            case "Add a new job application":
                addJob();
                break;
                
            case "Review all job applications":
                reviewJobs();
                break;

            case "Update a job application":
                updateJob();
                break;
            
            case "Delete a job application":
                deleteJob();
                break;
            
            case "Exit":
                connection.end();
                break;
            };
        });
}


const addJob = () => {
    inquirer
        .prompt([
            {
                name: "company",
                type: "input",
                message: "Company Name (required)"
            },
            {
                name: "position",
                type: "input",
                message: "Position applied for (required)"
            },
            {
                name: "salary",
                type: "input",
                message: "Salary (optional)",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false; 
                }
            },
            {
                name: "neighborhood",
                type: "input",
                message: "Location (optional)"
            },
            {
                name: "notes",
                type: "input",
                message: "Any notes? (optional)"
            }
        ])
        .then(function(answer) {
            connection.query(
                "INSERT INTO applications SET ?", 
                {
                    company: answer.company,
                    position: answer.position,
                    salary: answer.salary || null,
                    neighborhood: answer.neighborhood || null,
                    notes: answer.notes || null
                },
                function(err) {
                    if (err) throw (err);
                    console.log("Job successfully added  👍 \n");
                    mainMenu();
                }
            )
        });
};


const reviewJobs = () => {
   connection.query("SELECT * FROM applications", function(err, results) {
       if (err) throw (err);
       console.log(results);
   });
   inquirer
    .prompt([
        {
            name: "choice",
            type: "list",
            choices: [
                "Main Menu",
                "Exit"
            ]
        }
    ])
    .then(function (answers) {
        switch(answers.choice) {
            case "Main Menu":
                mainMenu();
                break;
            
            case "Exit":
                connection.end();
                break;
        }
    });

};


const updateJob = () => {
    connection.query("SELECT * FROM applications", function(err, results) {
        if (err) throw (err);
        inquirer
        .prompt([
            {
                name: "choice",
                type: "list",
                choices: function () {
                    let choiceArray = [];
                    for (let i=0; i < results.length; i++) {
                        choiceArray.push(results[i].company);
                    }
                    return choiceArray;
                },
                message: "Which company's job application would you like to update?"
            }
        ])
    })
 
}
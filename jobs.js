//dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
require('dotenv').config();

//setup db connection specifics
const connection = mysql.createConnection({
    host: process.env.DB_HOST,

    port: 3306,

    user: process.env.DB_USER,

    password: process.env.DB_PASS,
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
                "Track correspondence",
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
                selectCompanyToUpdate();
                break;
            
            case "Delete a job application":
                deleteJob();
                break;
            
            case "Track correspondence":
                selectCompanyToTrack();
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

const continueOption = () => {
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

}


const reviewJobs = () => {
   connection.query("SELECT * FROM applications", function(err, results) {
       if (err) throw (err);
       console.log(results);
       continueOption();
   });
   
};

const selectCompanyToUpdate = () => {
    connection.query("SELECT * FROM applications", function (err, res) {
        if (err) throw (err);
        inquirer
        .prompt([
            {
                name: "company",
                type: "list",
                choices: function() {
                    let companiesArray = [];
                    for (let i=0; i < res.length; i++) {
                        companiesArray.push(res[i].company);
                    }
                    return companiesArray;
                }
            }
        ])
        .then(function(answer) {
            let selectedCompany = answer.company;
            updateJob(selectedCompany);
        })
    })
};


const selectCompanyToTrack = () => {
    connection.query("SELECT * FROM applications", function (err, res) {
        if (err) throw (err);
        inquirer
        .prompt([
            {
                name: "company",
                type: "list",
                choices: function() {
                    let companiesToTrackArray = [];
                    for (let i=0; i < res.length; i++) {
                        companiesToTrackArray.push(res[i].company);
                    }
                    return companiesToTrackArray;
                }
            }
        ])
        .then(function(answer) {
            let selectedCompanyToTrack = answer.company;
            trackCorrespondence(selectedCompanyToTrack);
        })
    })
}

const updateJob = (selectedCompany) => {
   inquirer
   .prompt([
       {
           name: "category",
           type: "list",
           choices: [
                "Company Name",
                "Position",
                "Salary",
                "Location",
                "Notes"
           ],
           message: "Select a field to edit"
       },
       {
           name: "edit",
           type: "input",
           message: "Enter your desired edit"
       }
   ])
   .then(function (answers) {
       console.log("You selected to edit the field: " + answers.category + " for the company: " + selectedCompany + " . The following is what you typed as an edit: " + answers.edit);
       inquirer
       .prompt([
            {
                name: "confirm",
                type: "list",
                choices: [
                    "Yes",
                    "No"
                ],
                message: "Do you wish to proceed with these changes?"
            }
       ])
       .then(function(answer) {
           if( answer.confirm === "Yes") {
               console.log("Updating " + selectedCompany + "'s information...\n");
               console.log(answers.category);
               console.log(answers.edit);
                switch(answers.category) {
                    case "Company Name":
                        connection.query("UPDATE applications SET ? WHERE ?", 
                        [
                            {
                                company: answers.edit
                            },
                            {
                                company: selectedCompany
                            }
                        ], 
                        function(err, res) {
                            if (err) throw (err);
                            console.log(res.affectedRows + " applications updated!\n");
                            continueOption();
                        }
                        );
                        break;
                    case "Position":
                            connection.query("UPDATE applications SET ? WHERE ?", 
                            [
                                {
                                    position: answers.edit
                                },
                                {
                                    company: selectedCompany
                                }
                            ], 
                            function(err, res) {
                                if (err) throw (err);
                                console.log(res.affectedRows + " applications updated!\n");
                                continueOption();
                            }
                            );
                            break;
                        case "Salary":
                                connection.query("UPDATE applications SET ? WHERE ?", 
                                [
                                    {
                                        salary: answers.edit
                                    },
                                    {
                                        company: selectedCompany
                                    }
                                ], 
                                function(err, res) {
                                    if (err) throw (err);
                                    console.log(res.affectedRows + " applications updated!\n");
                                    continueOption();
                                }
                                );
                                break;
                        case "Location":
                                connection.query("UPDATE applications SET ? WHERE ?", 
                                [
                                    {
                                        location: answers.edit
                                    },
                                    {
                                        company: selectedCompany
                                    }
                                ], 
                                function(err, res) {
                                    if (err) throw (err);
                                    console.log(res.affectedRows + " applications updated!\n");
                                    continueOption();
                                }
                                );
                                break;
                        case "Notes":
                                connection.query("UPDATE applications SET ? WHERE ?", 
                                [
                                    {
                                        notes: answers.edit
                                    },
                                    {
                                        company: selectedCompany
                                    }
                                ], 
                                function(err, res) {
                                    if (err) throw (err);
                                    console.log(res.affectedRows + " applications updated!\n");
                                    continueOption();
                                }
                                );
                                break;
                        
                }
           } else {
               continueOption();
           }
       })
   })
};


const trackCorrespondence = (selectedCompanyToTrack) => {
    inquirer
    .prompt([
        {
            name: "question1",
            type: "list",
            choices: [
                "Yes",
                "No"
            ],
            message:  "Did you reach out to this company?"
        },
        {
            name: "question2",
            type: "list",
            choices: [
                "Yes",
                "No"
            ],
            message: "Did this company reach out to you?"
        }
    ])
    .then(function (answers) {
        switch (answers.question1) {
            case "Yes":
                connection.query("UPDATE applications SET ? WHERE ?",
                [
                    {
                        have_you_followed_up: 1
                    },
                    {
                        company: selectedCompanyToTrack
                    }
                ], function(err, res) {
                    if (err) throw (err);
                    //console.log(res.affectedRows + " applications updated!\n");
                    //continueOption();
                })
                break;
            
            case "No":
                    connection.query("UPDATE applications SET ? WHERE ?",
                    [
                        {
                            have_you_followed_up: 0
                        },
                        {
                            company: selectedCompanyToTrack
                        }
                    ], function(err, res) {
                        if (err) throw (err);
                        //console.log(res.affectedRows + " applications updated!\n");
                        //continueOption();
                    })
                break;
        };
        switch (answers.question2) {
            case "Yes":
                connection.query("UPDATE applications SET ? WHERE ?", 
                [
                    {
                        has_employer_reached_out: 1
                    },
                    {
                        company: selectedCompanyToTrack
                    }
                ], function (err, res) {
                    if (err) throw (err);
                    //console.log(res.affectedRows + " applications updated!\n");
                    //continueOption();
                })
                break;
            
            case "No":
                connection.query("UPDATE applications SET ? WHERE ?", 
                [
                    {
                        has_employer_reached_out: 0
                    },
                    {
                        company: selectedCompanyToTrack
                    }
                ], function (err, res) {
                    if (err) throw (err);
                    // console.log(res.affectedRows + " applications updated!\n");
                    //continueOption();
                })
                break;
        }
    console.log("👍 applications updated!\n");
    continueOption();
    });
};
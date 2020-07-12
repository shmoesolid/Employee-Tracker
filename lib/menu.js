const inquirer = require('inquirer');

const isNotBlank = (string) =>
{
    if (!string) return "Value must not be blank...";
    return true;
};

var Menu =
{
    list: function(choiceArray, customMessage = "Select an option:")
    {
        inquirer
        .prompt(
            {
                name: "select",
                type: "list",
                message: customMessage,
                choices: choiceArray.map( obj => obj.msg )
            }
        ).then( answer =>
            {
                var choiceObj = choiceArray.find(obj => obj.msg == answer.select);
                if (choiceObj) choiceObj.execute();
            }
        );
    },
    input: function(questionsArray, cb)
    {
        questionsArray.forEach( obj =>
            {
                obj.type = "input";
                obj.validate = name => isNotBlank(name);
            }
        );

        inquirer
        .prompt(questionsArray)
        .then( function(answer) { cb(answer) } );
    }
};

module.exports = Menu;
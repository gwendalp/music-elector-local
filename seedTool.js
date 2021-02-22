#!/usr/bin/env node

module.exports = {
seed:function(){
require('mongoose').connect('mongodb://localhost/pollser');

const topics = [
    "Which music should be played next?"
];

const Poll = require('./models/poll');

// empty the collection first
Poll.remove({})
    .then(() => {
        let polls = [];
        for (let i = 0; i < 1; i++) {
            polls.push({
                topic: topics[i],
                choices: [
                    {
                        value: "Like a Rolling Stone - Bob Dylan",
                        votes: 0
                    },
                    {
                        value: "Breakfast in America - Supertramp",
                        votes: 0
                    },
                    {
                        value: "The Less I Know The Better- Tame Impale",
                        votes: 0
                    },
                    {
                        value: "Hallelujah - Leonard Cohen",
                        votes: 0
                    },
                    
                    {
                        value: "Rappel - Vald",
                        votes: 0
                    },
                    
                    {
                        value: "Numb - Linkin Park",
                        votes: 0
                    },
                    
                    {
                        value: "Whiskey in the Jar - The Dubliners",
                        votes: 0
                    },
                    

                    

                ]
            });
        }
        return Poll.create(polls);
    })
    
}


}
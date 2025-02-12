module.exports = {
    presets: [["@babel/preset-env", { targets: { node: "current" } }]],
    ignore: [],
    overrides: [
        {
            test: /node_modules\/camunda-external-task-client-js\//,
            presets: [["@babel/preset-env", { targets: { node: "current" } }]]
        }
    ]
};

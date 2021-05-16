module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageDirectory: "./results",
    reporters: [
        "default",
        [
            "jest-junit",
            {
                "outputDirectory": "./results",
                "outputName": "junit.xml",
            }
        ]
    ],
};

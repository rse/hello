
const fs       = require("fs")
const yargs    = require("yargs")
const nunjucks = require("nunjucks")
const HAPI     = require("@hapi/hapi")

const argv = yargs.usage("Usage: hello [options]")
    .string("t").alias("t", "template").nargs("t", 1)
        .describe("t", "message template")
        .default("t", "")
    .string("g").alias("g", "greeting").nargs("g", 1)
        .describe("g", "greeting phase")
        .default("g", process.env.HELLO_GREETING ? process.env.HELLO_GREETING : "Hello")
    .string("c").alias("c", "contact").nargs("c", 1)
        .describe("c", "contact name")
        .default("c", process.env.HELLO_CONTACT ? process.env.HELLO_CONTACT : "World")
    .number("l").alias("l", "listen").nargs("l", 1)
        .describe("l", "listen on TCP port")
        .default("l", 0)
    .parse(process.argv.slice(2))

const template = argv.template !== "" ? fs.readFileSync(argv.template, "utf8") : "{{ greeting }}, {{ contact }}!\n"
const message  = nunjucks.renderString(template, { greeting: argv.greeting, contact: argv.contact })

if (argv.listen > 0) {
    process.stderr.write(`starting Hello daemon process on port ${argv.listen}\n`)
    const service = HAPI.server({ host: "0.0.0.0", port: argv.listen })
    service.route({ method: "GET", path: "/", handler: (req, h) => h.response(message) })
    service.start()
}
else
    process.stdout.write(message)


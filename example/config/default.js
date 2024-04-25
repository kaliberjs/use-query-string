module.exports = {
  kaliber: {
    compileWithBabel: [
      /@kaliber\/use-query-string/,
      /filter-obj/,
      /query-string/,
      /split-on-first/,
      /strict-uri-encode/,
    ],
    universal: {
      clientWrapper: '/wrappers/Client',
      serverWrapper: '/wrappers/Server',
    },
  }
}

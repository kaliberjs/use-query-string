module.exports = {
  kaliber: {
    compileWithBabel: [
      /@kaliber\//,
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

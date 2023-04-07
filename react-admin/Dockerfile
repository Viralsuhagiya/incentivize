FROM node:16

WORKDIR /app

COPY package.json yarn.lock Makefile lerna.json .yarnrc ./

# It's ugly, but its necessary for docker caching
COPY examples/protiv/package.json examples/protiv/
COPY examples/crm/package.json examples/crm/
COPY examples/data-generator/package.json examples/data-generator/
COPY examples/demo/package.json examples/demo/
COPY examples/no-code/package.json examples/no-code/
COPY examples/simple/package.json examples/simple/
COPY examples/tutorial/package.json examples/tutorial/

COPY packages/ra-core/package.json packages/ra-core/
COPY packages/ra-data-fakerest/package.json packages/ra-data-fakerest/
COPY packages/ra-data-graphql/package.json packages/ra-data-graphql/
COPY packages/ra-data-graphql-simple/package.json packages/ra-data-graphql-simple/
COPY packages/ra-data-json-server/package.json packages/ra-data-json-server/
COPY packages/ra-data-localstorage/package.json packages/ra-data-localstorage/
COPY packages/ra-data-simple-rest/package.json packages/ra-data-simple-rest/
COPY packages/ra-i18n-polyglot/package.json packages/ra-i18n-polyglot/
COPY packages/ra-input-rich-text/package.json packages/ra-input-rich-text/
COPY packages/ra-language-english/package.json packages/ra-language-english/
COPY packages/ra-language-french/package.json packages/ra-language-french/
COPY packages/ra-no-code/package.json packages/ra-no-code/
COPY packages/ra-test/package.json packages/ra-test/
COPY packages/ra-ui-materialui/package.json packages/ra-ui-materialui/
COPY packages/react-admin/package.json packages/react-admin/

RUN make install

COPY . .

RUN make build

CMD make run-protiv
## How to run
# Clone react-admin 
------------------------------------------------
git clone https://gitlab.com/protiv/react-admin.git

# After having cloned the react-admin repository, run the following commands at the react-admin root:
----------------------------------------------------------------------------------------------------
Ubuntu
---------
-> curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
-> nvm install v14.19.0

MacOS
-------
-> curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
-> export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
-> nvm install v14.19.0

npm install --global yarn
make install
make build
# Replace Local Backend Proxy
--------------------------
Open /protiv/package.json
"proxy": "http://localhost:8069" 

# Replace User Pool and Web Client Id
-------------------------------------
Open /react-admin/examples/protiv/src/aws-exports.js
"aws_user_pools_id": "us-east-1_eXdiXF8Og",
"aws_user_pools_web_client_id": "418ecbsit3ofamplaanps7g3kd"

# Start Front End
------------------
make run-protiv

# Default Credential
------------------
Email - admin
Password - x8NqANJzsbZKhvNfFKZ9Kw3K

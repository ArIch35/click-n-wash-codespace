# If the script can not be launched, run the following command first:
# chmod +x nginx-install.sh

# Example config for nginx.conf for frontend
# config="location /$DIR_NAME {
#     root $FILE_DIR;
#     index index.html;
#     try_files \$uri \$uri/ =404;
# }"

# Example config for nginx.conf for backend
# config="location /api {
#     proxy_set_header    Host             \$host;
#     proxy_set_header    X-Real-IP        \$remote_addr;
#     proxy_set_header    X-Forwarded-For  \$proxy_add_x_forwarded_for;
#     proxy_set_header    X-Forwarded-Proto https;
#     proxy_pass http://localhost:9999/api;
# }"

function remove_config_and_dist() {
    echo "Removing the nginx config and the distribution."
    sudo rm -rf $FILE_CONFIG
    sudo rm -rf $FILE_DIR
    echo "The nginx config and the distribution have been removed."
}

# Shows the user how to use the script if no parameters are entered
if [ -z "$1" ]; then
    echo "You have not entered any parameters. The parameters are optional."
    echo "Usage: ./deploy.sh [OPTIONS]"
    echo "Example: ./deploy.sh -d example.com"
    echo "Example: ./deploy.sh -d example.com -p 8080"
    echo "Options:"
    echo "-d, --domain    The domain name of the website."
    echo "-p, --port      The port number of the backend."
fi

# Read parameters --domain and --port
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -d|--domain) DOMAIN="$2"; shift ;;
        -p|--port) PORT="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

# Throw an error if the port number is empty
if [ -z "$PORT" ]; then
    echo "The port number is empty. Please enter a port number."
    exit 1
fi

GITHUB_GIST=https://gist.github.com/nicanderhery/2c06fb6f5688a59ce29046dd5ed3a512
NGINX_HTML_ADDRESS=/var/www/html
DIR_NAME=${PWD##*/}
FILE_DIR="$NGINX_HTML_ADDRESS/$DOMAIN/$DIR_NAME"
FILE_CONFIG=/etc/nginx/domain_routes/$DOMAIN.$DIR_NAME.conf
FRONTEND_DIR=frontend/dist

# DON'T FORGET TO SET THE CONFIG
CONFIG="location / {
    root $FILE_DIR;
    index index.html;
    try_files \$uri \$uri/ /index.html;
}

location /api {
    proxy_set_header    Host             \$host;
    proxy_set_header    X-Real-IP        \$remote_addr;
    proxy_set_header    X-Forwarded-For  \$proxy_add_x_forwarded_for;
    proxy_set_header    X-Forwarded-Proto https;
    proxy_pass http://localhost:$PORT/api;
}

location /socket.io {
    proxy_set_header    Host             \$host;
    proxy_set_header    X-Real-IP        \$remote_addr;
    proxy_set_header    X-Forwarded-For  \$proxy_add_x_forwarded_for;
    proxy_set_header    X-Forwarded-Proto https;
    proxy_pass http://localhost:$PORT/socket.io;
}"

# Check whether config is empty
if [ -z "$CONFIG" ]; then
    echo "The nginx config is empty. Please check the nginx config."
    exit 1
fi

# Check whether domain is empty, then set FILE_DIR to $NGINX_HTML_ADDRESS/$DIR_NAME
if [ -z "$DOMAIN" ]; then
    FILE_DIR="$NGINX_HTML_ADDRESS/$DIR_NAME"
    FILE_CONFIG=/etc/nginx/domain_routes/$DIR_NAME.conf
fi

# Check if the /var/www/html/$DOMAIN directory exists
if [ ! -d "$NGINX_HTML_ADDRESS/$DOMAIN" ]; then
    echo "The /var/www/html/$DOMAIN directory does not exist. Please run the script from $GITHUB_GIST."
    exit 1
fi

# Check whether $FRONTEND_DIR is present or empty
if [ ! -d "$FRONTEND_DIR" ] || [ -z "$(ls -A $FRONTEND_DIR)" ]; then
    echo "$FRONTEND_DIR is not present or empty. Please run the following command first:"
    echo "npm run build"
    exit 1
fi

# Check whether the directory's name contains a dot or a space
if [[ "$PWD" =~ \.|\  ]]; then
    echo "The directory's name contains a dot or a space. Please rename the directory and try again."
    exit 1
fi

# Check whether nginx is installed
if [ ! -x "$(command -v nginx)" ]; then
    echo "nginx is not installed. Please install nginx first."
    exit 1
fi

# Create the directory $FILE_DIR if it does not exist
if [ ! -d "$FILE_DIR" ]; then
    sudo mkdir -p $FILE_DIR
fi

# Create the directory /etc/nginx/domain_routes if it does not exist
if [ ! -d "/etc/nginx/domain_routes" ]; then
    sudo mkdir -p /etc/nginx/domain_routes
fi

# Copy nginx config to /etc/nginx/domain_routes
echo "$CONFIG" | sudo tee $FILE_CONFIG > /dev/null

# Copy the distribution to the directory if it contains index.html
if [ -d "$FRONTEND_DIR" ] && [ -f "$FRONTEND_DIR/index.html" ]; then
    sudo cp -r $FRONTEND_DIR/* $FILE_DIR
fi

# Check whether syntax of nginx config is correct
if [ ! -x "$(command -v nginx -t)" ]; then
    echo "nginx -t is not available. Please check the nginx config."
    remove_config_and_dist
fi

# Check whether syntax of nginx config is correct
output=$(sudo nginx -t 2>&1)
if [[ $output == *"test is successful"* ]]; then
    echo "nginx config for $DIR_NAME is valid."
else
    echo "$output"
    echo "nginx config for $DIR_NAME is invalid. Please check the nginx config."
    remove_config_and_dist
    exit 1
fi

# Reload nginx
sudo nginx -s reload
echo "nginx has been reloaded."
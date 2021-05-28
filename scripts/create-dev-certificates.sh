mkdir -p certs

openssl req \
	-x509 \
	-newkey rsa:4096 \
	-keyout certs/server_key.pem \
	-out certs/server_cert.pem \
	-nodes \
	-days 365 \
	-subj "/CN=localhost/O=CWA\ Dev"

openssl req \
	-newkey rsa:4096 \
	-keyout certs/client_key.pem \
	-out certs/client_csr.pem \
	-nodes \
	-days 365 \
	-subj "/CN=Client"

openssl x509 \
	-req \
	-sha256 \
	-in certs/client_csr.pem \
	-CA certs/server_cert.pem \
	-CAkey certs/server_key.pem \
	-out certs/client_cert.pem \
	-set_serial 01 \
	-days 365
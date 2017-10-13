#!/bin/zsh
(
rm -r qr/*;
# generate_qr name host
generate_qr(){
	for i in \
		index.html \
		station.html \
		outpost.html \
		auxiliary.html \
		battle.html\?zone={1..5} \
		artifact.html\?artid={elk,oak,moose,carrot,hip2b};
		do
			mkdir qr/$1 &> /dev/null;
			FILENAME=`echo $i | sed 's/[^A-Za-z0-9]//g' | sed 's/html//g'`.png;
			qrencode -o qr/$1/$FILENAME "$2/$i";
		done;
	}

	generate_qr pi "http://192.168.1.4"
	generate_qr github "https://voidcase.github.io"
)

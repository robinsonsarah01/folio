
/* if JavaScript is enabled, we don't want to show text that's
   just there for when there's no JavaScript */
document.write("<style type=\"text/css\"> .nojstext { display: none } </style>\n");

function Name(sz1, sz2, ch)
{
	sz = '\74\101\40\150\162\145\146\75\42';
	sz += '\155\141\151\154\164\157\72';
	sz += sz1 + '\100' + sz2 + '\56';
	switch(ch)
	{
	case 'c':
	case 'C':
		sz += '\143\157\155';
		break;
	case 'o':
	case 'O':
		sz += '\157\162\147';
		break;
	case 'n':
	case 'N':
		sz += '\156\145\164';
		break;
	}
	sz += '\42\76';

	sz += sz1;
	
	sz += '\74\57\101\76';

	return sz;
}

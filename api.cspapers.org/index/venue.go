package main

var idToVenue = map[string]string{
	"939c6e1d-0d17-4d6e-8a82-66d960df0e40": "iclr",
	"fc0a208c-acb7-47dc-a0d4-af8190e21d29": "icml",
	"bdc2e585-4e48-4e36-8af1-6d859763d405": "aaai",
	"67f7f831-711a-43c8-8785-1e09005359b5": "ijcai",
	"8dce23a9-44e0-4381-a39e-2acc1edff700": "sigir",
	"768b87bb-8a18-4d9c-a161-4d483c776bcf": "cvpr",
	"01103732-3808-4930-b8e4-7e9e68d5c68d": "naacl",
	"f68b9e7e-ad3d-46cb-857d-23e49384143c": "sigmod",
	"41bf9ed3-85b3-4c90-b015-150e31690253": "emnlp",
	"b55b50b1-aae7-47a7-b042-8aecc930073d": "chi",
	"c62b1316-0733-4b4c-8017-c07e18afa954": "uist",
	"8793834a-83cf-4194-9973-b8a7b3681191": "wine",
	"23c7a077-c4e3-49ec-8b83-6010948c1b30": "rss",
	"3f2626a8-9d78-42ca-9e0d-4b853b59cdcc": "icra",
	"37275deb-3fcf-4d16-ae77-95db9899b1f3": "iros",
	"a36dc29e-4ea1-4567-b0fe-1c06daf8bee8": "icse",
	"289bfdda-eab3-4c9a-97be-ef1e0f9ddfc0": "issta",
	"e4f51561-5050-4b9c-87c2-c49957677fbf": "eurosys",
	"e07422f9-c065-40c3-a37b-75e98dce79fe": "www",
	"41929b26-d887-42cf-97f1-1217a0a9e315": "mobisys",
	"5440268e-4691-4fc0-8d0e-dcd6df18e77f": "mobicom",
	"5a284490-40a3-4a14-a5c1-51a423dffad6": "sensys",
	"68cf0e99-5164-4480-8ed4-8b8416a091df": "focs",
	"5545566b-c0b8-418c-83a5-a986a4657572": "soda",
	"8113a511-e0d9-4231-a1bc-0bf5d0212a4e": "stoc",
	"3673dec6-881d-437a-8c5d-710b0e94690c": "lics",
	"86c43745-31d9-4c1a-b33f-ce3aa0042dbb": "osdi",
	"6c6fcaa9-fd25-488b-8050-995227ac671c": "sosp",
	"29b9c461-963e-4d11-b2ab-92c182243942": "s&p",
	"e6904c24-9546-4135-8344-e3999e375558": "ndss",
	"73f7fe95-b68b-468f-b7ba-3013ca879e50": "ccs",
	"82901c74-dc2e-4d08-b633-637c7e209284": "sigcomm",
	"38e1b942-a62d-4d74-8e5d-677db6ed425f": "nsdi",
	"26d7e132-5fee-4b79-84cd-fc36a43b5114": "emsoft",
	"48b6d520-4f0d-447a-b3ad-95824c5334c7": "rtas",
	"c43b7adc-9683-46d3-a4a1-f6edfd9695b2": "rtss",
	"021b37d3-cef1-4c12-a442-257f7900c23d": "dac",
	"50f05842-47b7-4c4e-8b23-85545a41a930": "iccad",
	"27b93d96-c4b9-4a23-a3a0-061ad54deebc": "hpdc",
	"914d4734-285a-4cd8-bba1-eec0db26a512": "ics",
	"7ed86435-f510-45fe-b582-c212782023aa": "sc",
	"68f951c0-009e-4451-9fdd-fb6fb73a47af": "imc",
	"2194778f-4fb6-471e-b2ff-5ad194635f72": "sigmetrics",
	"deedf64a-dd5c-4b33-b345-ff83bfb93d71": "isca",
	"0942fb86-c16f-4084-9902-10ddcfe18180": "micro",
	"b7aa40ac-729b-49d6-9064-4d1a9480e9a9": "hpca",
	"a0edb93b-1e95-4128-a295-6b1659149cef": "kdd",
	"7431ff67-91dc-41fa-b322-1b1ca657025f": "cikm",
	"67d15a94-d523-4b5f-be58-03fe2ef9dcfb": "icdm",
	"87fc9c3c-cc7f-42aa-ba71-2700729a6788": "asiaccs",
	"91d4ecad-d022-4953-901e-c5c57c614f72": "acsac",
	"4c2b8cb8-e51c-4ece-9122-89595989b56f": "EuroS&P",
	"9448f839-459b-45f3-8573-5eff3f032334": "usenix atc",
	"54649c1d-6bcc-4232-9cd1-aa446867b8d0": "USENIX Secur Symp",
	"89a13061-deba-4155-a533-2c60ea096c6f": "fse",
	"1c2ab05c-7d69-465e-929d-0920857aedce": "ase",
	"3c2dd17d-6c11-4bb6-9d01-1fc2064cb8df": "ec",
	"d9720b90-d60b-48bc-9df8-87a30b9a60dd": "neurips",
	"2b672dfa-333b-4231-b056-bb6ec13c2173": "ubicomp",
	"1e33b3be-b2ab-46e9-96e8-d4eb4bad6e44": "acl",
	"a5c58053-0673-4cdb-b2b8-b6b0ad6911d1": "vldb",
	"d4610af5-85e0-480b-8773-5c71d92a7b99": "asplos",
	"115bf398-2c82-4de3-98ec-5c6911e53569": "eurocrypt",
	"212b6868-c374-4ba2-ad32-19fde8004623": "crypto",
	"2c9ecac6-f875-4a9b-acc2-10bd9f6782df": "sigcse",
	"167fa0ca-e88a-4ef7-a16f-bc66c457c806": "eccv",
	"7654260e-79f9-45c5-9663-d72027cf88f3": "iccv",
	"a771789a-19af-47af-b65e-a7ddd8cb9ea7": "splash",
	"de124794-a8b5-43ce-b740-7643c17bb1ea": "oopsla",
	"8a1922a5-8e84-4ec6-9283-01f2ef1981fc": "popl",
	"a00a1a4f-16c6-4360-a8b3-a3f88d2fe78f": "pldi",
}

var venueAlias = map[string]string{
	"EuroS&P":           "EuroSP",
	"S&P":               "SP",
	"usenix atc":        "ATC",
	"USENIX Secur Symp": "USENIX",
}

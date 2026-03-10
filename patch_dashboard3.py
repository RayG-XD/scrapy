import re

with open("scrapy-ui/src/app/dashboard/dashboard.ts", "r") as f:
    content = f.read()

if "ChangeDetectorRef" not in content:
    content = content.replace("import { OnInit } from '@angular/core';", "import { OnInit, ChangeDetectorRef } from '@angular/core';")

content = re.sub(r"constructor\(private http: HttpClient\) \{\}", "constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}", content)

content = content.replace("this.activeJobsData = [...data];", "this.activeJobsData = [...data];\n        this.cdr.detectChanges();")
content = content.replace("endTime: new Date(job.endTime)\n        }))];", "endTime: new Date(job.endTime)\n        }))];\n        this.cdr.detectChanges();")

with open("scrapy-ui/src/app/dashboard/dashboard.ts", "w") as f:
    f.write(content)

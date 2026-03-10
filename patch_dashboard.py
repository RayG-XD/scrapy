with open("scrapy-ui/src/app/dashboard/dashboard.ts", "r") as f:
    content = f.read()

content = content.replace("this.activeJobsData = data;", "this.activeJobsData = [...data];")
content = content.replace("this.recentJobsData = data.map(job => ({", "this.recentJobsData = [...data.map(job => ({")
content = content.replace("endTime: new Date(job.endTime)\n        }));", "endTime: new Date(job.endTime)\n        }))];")

with open("scrapy-ui/src/app/dashboard/dashboard.ts", "w") as f:
    f.write(content)

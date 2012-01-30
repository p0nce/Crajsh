from shutil import *
import os, subprocess, glob, time, string
import re

js_files = ["gfm",
           "renderer",
           "texture",
           "texturemanager",
           "viewport",
           "world",
           "bullet",
           "bulletpool",
           "player",
           "camera",
           "game",
           "pattern",
           "patternmanager",
           "main",
           "sound",
           "sample",
           "audiomanager",
           "letters"]

js_file_paths = ["js/" + f + ".js" for f in js_files]

#read all translation rules
rule_regexp = re.compile("^(\w+)\s*=>\s*(\w+)\s*$")

rules = []
n = 0;
print("Reading rules...")
for line in open("words.txt", 'r').readlines():
    n = n + 1;
    r = rule_regexp.match(line)

    if r:
#        print(line)
        src = r.group(1)
        dest = r.group(2)
#        print("matched rule: " + src + " => " + dest)
        rules.append((src, dest))
    else:
        print("unmatched rule : " + line.rstrip())

print("Found " + str(len(rules)) + " rules")
print("Merging all files...")

# merge all files in a crajsh_concat.js file
def combine_files(fileList, res):
    f = open(res, 'w')
    for file in fileList:
        f.write(open(file).read())
    f.close()
    
concat_file = "js/crajsh_concat.js"
combine_files(js_file_paths, concat_file)

print("Apply rules...")
# apply all translation rules to the concat file
translated_file = "js/crajsh_translated.js"
f = open(translated_file, 'w')
for line in open(concat_file, 'r').readlines():
    for rule in rules:
        src = rule[0]
        dest = rule[1]
        line = line.replace(src, dest)
    f.write(line)
f.close();    

minified_file = "js/crajsh_minified.js"

print("YUI compress...")

cmd = ["java", "-jar", "../yuicompressor-2.4.2/build/yuicompressor-2.4.2.jar", "--line-break 80", "-o " + minified_file, translated_file];
cmd.append(">output.txt");
cmd.append("2>output2.txt");    

cmdline = " ".join(cmd)
err = os.system(cmdline)

if err == 0:
    print("Everything went like expected. :)")
else:
    print("Oh no, an error occured. See error.txt")

# append text to compressed javascript
combine_files(["license.txt", minified_file], "js/crajsh.js")

#os.remove(minified_file)
#os.remove(concat_file)
#os.remove(translated_file)

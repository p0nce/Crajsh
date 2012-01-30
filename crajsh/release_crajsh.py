# This Python 3.1 script extract useful files for a standalone app

from shutil import *
import os, subprocess, glob, time, string


source_folder = "."
destination_folder = "../../web/www.crajsh.com/"

#print "Deleting " + destination_folder
#rmtree(destination_folder, True) # ignore errors

def createDir(dirname):    
    try:
        print("Creating folder " + dirname)
        os.makedirs(dirname)
    except OSError:
        if os.path.exists(dirname):
            # We are nearly safe
            pass
        else:
            # There was an error on creation, so make sure we know about it
            raise
        

createDir(destination_folder)
createDir(destination_folder + "js/")
createDir(destination_folder + "img/")
createDir(destination_folder + "sound/")
createDir(destination_folder + "css/")
createDir(destination_folder + "css/redmond/")
createDir(destination_folder + "css/redmond/images")


def outputFiles(source_dir, dest_dir, filename_with_wildcards):

    def outputFile(source_dir, dest_dir, filename):    
        src = source_folder + source_dir + filename
        dst = destination_folder + dest_dir + filename
        print ("Copying " + src + " to " + dst)
        copyfile(filename, dst)
        return

    def find(filename_with_wildcards):
        s = glob.glob(filename_with_wildcards)
        if len(s) == 0:
            print ("WARNING: no file found for " + filename_with_wildcards)
            print ("supposedly in '" + source_dir + "'\n")
#            exit(1)
        return s    

    os.chdir(source_folder + source_dir)
    filenames = find(filename_with_wildcards);

    
    for f in filenames:
        outputFile(source_dir, dest_dir, f)
        
outputFiles("", "", "*.htm")        
outputFiles("", "", "js/crajsh.js")
outputFiles("", "", "js/jquery-1.4.2.min.js")
outputFiles("", "", "js/jquery-ui-1.8.5.custom.min.js")
outputFiles("", "", "js/excanvas.compiled.js")
outputFiles("", "", "img/*.png")
outputFiles("", "", "img/*.gif")
outputFiles("", "", "css/redmond/jquery-ui-1.8.5.custom.css")
outputFiles("", "", "css/redmond/images/*.png")
outputFiles("", "", "sound/*.ogg")
outputFiles("", "", "sound/*.mp3")
outputFiles("", "", "favicon.ico")

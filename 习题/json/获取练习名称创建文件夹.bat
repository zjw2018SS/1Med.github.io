@echo off
set /p address=Please enter the required directory address:
echo %address%
set /p file_arr=Please enter the array of folders to be created:
echo %file_arr%
set var=\
for  %%x in (%file_arr%) do md %address%%var%%%x 
@REM pause
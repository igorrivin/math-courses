LATEX = pdflatex
FLAGS = -interaction=nonstopmode -halt-on-error -file-line-error
STUDENT = probability_midterm_01_makeup_student
INSTRUCTOR = probability_midterm_01_makeup_instructor

.PHONY: all clean
all: $(STUDENT).pdf $(INSTRUCTOR).pdf

$(STUDENT).pdf: student.tex exam.tex
	$(LATEX) $(FLAGS) -jobname=$(STUDENT) student.tex
	$(LATEX) $(FLAGS) -jobname=$(STUDENT) student.tex

$(INSTRUCTOR).pdf: instructor.tex exam.tex
	$(LATEX) $(FLAGS) -jobname=$(INSTRUCTOR) instructor.tex
	$(LATEX) $(FLAGS) -jobname=$(INSTRUCTOR) instructor.tex

clean:
	rm -f *.aux *.log *.out *.fls *.fdb_latexmk *.synctex.gz

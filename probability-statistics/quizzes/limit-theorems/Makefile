LATEX = pdflatex
FLAGS = -interaction=nonstopmode -halt-on-error -file-line-error
STUDENT = limit_theorems_quiz_student
INSTRUCTOR = limit_theorems_quiz_instructor

.PHONY: all clean
all: $(STUDENT).pdf $(INSTRUCTOR).pdf

$(STUDENT).pdf: student.tex quiz.tex
	$(LATEX) $(FLAGS) -jobname=$(STUDENT) student.tex
	$(LATEX) $(FLAGS) -jobname=$(STUDENT) student.tex

$(INSTRUCTOR).pdf: instructor.tex quiz.tex
	$(LATEX) $(FLAGS) -jobname=$(INSTRUCTOR) instructor.tex
	$(LATEX) $(FLAGS) -jobname=$(INSTRUCTOR) instructor.tex

clean:
	rm -f $(STUDENT).aux $(STUDENT).log $(STUDENT).out
	rm -f $(INSTRUCTOR).aux $(INSTRUCTOR).log $(INSTRUCTOR).out

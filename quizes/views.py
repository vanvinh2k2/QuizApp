from django.shortcuts import render
from .models import Quiz
from questions.models import Question, Answer
from results.models import Result
from django.http import JsonResponse
from django.views.generic import ListView
# Create your views here.

class QuizListView(ListView):
    model = Quiz
    template_name = 'quizes/main.html'

def quiz_view(request, pk):
    quiz = Quiz.objects.get(pk=pk)
    return render(request, 'quizes/quiz.html', {'obj': quiz})

def quiz_data_view(request, pk):
    quiz = Quiz.objects.get(pk=pk)
    question = []
    for q in quiz.get_question():
        answer=[]
        for a in q.get_answers():
            answer.append(a.text)
        question.append({str(q): answer})
    return JsonResponse({"data": question, "time": quiz.time,})

def save_quiz_view(request, pk):
    questions=[]
    data = request.POST
    data_ = dict(data)
    data_.pop('csrfmiddlewaretoken')

    for i in data_.keys():
        question = Question.objects.filter(text=i)
        questions.extend(question) 
    
    user = request.user
    quiz = Quiz.objects.get(pk=pk)

    score = 0
    mult = 100 / quiz.number_of_questions
    result = []
    correct_answer = None

    for q in questions:
        a_selected = request.POST.get(q.text)
        if a_selected != "":
            question_answer = Answer.objects.filter(question=q)
            for a in question_answer:
                if a.text == a_selected:
                    if a.correct:
                        score += 1
                        correct_answer = a.text
                else:
                    if a.correct:
                        correct_answer = a.text
            result.append({str(q): {'correct_answer': correct_answer, 'answered': a_selected}})
        else:
            result.append({str(q): 'not answered'})
    score_ = score * mult

    Result.objects.create(quiz=quiz,user=user,score=score_)

    if score_ >= quiz.required_score_to_pass:
        return JsonResponse({"passed": True, 'score': score_, 'results': result})
    else:
        return JsonResponse({"passed": False, 'score': score_, 'results': result})
    
    return JsonResponse({"text":'words'})

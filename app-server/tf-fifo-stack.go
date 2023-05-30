package main

import (
	"sync"
)

type TF_FIFOStack struct {
	lock  sync.Mutex
	stack []int
}

func (s *TF_FIFOStack) Push(x int) {
	s.lock.Lock()
	defer s.lock.Unlock()
	s.stack = append(s.stack, x)
}

func (s *TF_FIFOStack) Pop() (int) {
	s.lock.Lock()
	defer s.lock.Unlock()
	if len(s.stack) == 0 {
		return 0
	}
	x := s.stack[0]
	s.stack = s.stack[1:]
	return x
}

func fillStack(s *TF_FIFOStack){
	for i := 100; i <= 10000; i++ {
		s.Push(i)
	}
}
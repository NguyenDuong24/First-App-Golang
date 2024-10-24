package service

import (
	"errors"
	"first-app/internal/user/entity"
	"first-app/internal/user/repository"
)

type UserService struct {
	repo *repository.UserRepository
}

func (s *UserService) GetUser(id uint) (*entity.User, error) {
	user, err := s.repo.GetUserByID(id)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("user not found")
	}
	return user, nil
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) GetAllUsers() ([]entity.User, error) {
	return s.repo.GetAllUsers()
}

func (s *UserService) CreateUser(user *entity.User) error {
	return s.repo.CreateUser(user)
}

func (s *UserService) UpdateUser(user *entity.User) error {
	return s.repo.UpdateUser(user)
}

func (s *UserService) DeleteUser(id uint) error {
	return s.repo.DeleteUser(id)
}

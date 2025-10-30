// File: com/project/btl/repository/AddressRepository.java
package com.project.btl.repository;
import com.project.btl.model.entity.Address;
import com.project.btl.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {
    List<Address> findByUser(User user);
}